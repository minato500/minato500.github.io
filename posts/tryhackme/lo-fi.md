# Lo-Fi

This is the easy ctf challenge where we can find the answers in minutes and this challenge consist of the LFI Path Traversal and File Inclusion

This is the [Lo-Fi](https://tryhackme.com/room/lofi) ctf in TryHackMe

### Nmap result

```
nmap 10.10.252.220
Starting Nmap 7.95 ( https://nmap.org ) at 2025-07-24 10:39 IST
Nmap scan report for 10.10.252.220
Host is up (0.41s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http

Nmap done: 1 IP address (1 host up) scanned in 32.46 seconds
```

So now we moving to the website hosted in default port

![lofi](./static/images/lofi1.png)

we can see search functionality which retrieves a **Local File** and it trusts the user input

![lofi](./static/images/lofi2.png)

Now we can do LFI default payload to confirm it

```
../../../etc/passwd
```

Now we can see the passwd file

![lofi](./static/images/lofi3.png)

As we know the for the ctf the file for victory is flag.txt it could be in / directory or other user home directory

![lofi](./static/images/lofi4.png)

Hurray finally we found the flag

In real world we can include any local file and the positions of /etc/passwd could vary, we want to find /etc/passwd to make easier navigation to file system and for that we use the worldlists for the lfi

Happy Hacking :)

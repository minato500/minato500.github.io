# Gaining Access

Gaining Access stage is where the attacker actively exploits vulnerabilities that is found in earlier stages (like information gathering, scanning and enumeration and vulnerability identification) to enter the target system or application.

Here the vulnerabilities includes

- Cross-Site Scripting (XSS)
- Access Control Vulnerabilities
- Authentication Vulnerabilities
- SQL Injection
- LFI and RFI
- Cross-Site Request Forgery (CSRF)
- Server-Side Request Forgery (SSRF)
- Remote Code Execution (RCE)
- Command Injection
- File Upload Vulnerabilities 

There are still lot more vulnerabilities exists and these vulnerabilities are also chained to exploit the systems

## Short Introduction

### Cross-Site Scripting (XSS)

Injecting malicious JavaScript into web pages to steal cookies or session tokens of the other user. The attacker uploads a malicious javascript in web application (eg post malicious javascript in comments) which run in the another user browser when they visit the application 

```
// example for Reflected XSS
<script>alert("Hehe...")</script>
```

### Access Control Vulnerabilities

Access control vulnerabilities are where the unintended user or lower privileged user can access and manage the resources (ie can access, modify and delete the data) that are only intent to high privileged users 

**Example:** The Admin panel is without login or left unprotected but running in high port which could be found using the nmap scanning

### Authentication Vulnerabilities

Authentication is used to protect web application from unauthorised use, and it is used to verify the user and allow authorised used to access the resources. But Authentication Vulnerabilities could arises due improper code for authentication, use of default password, lack of brute force attack and rate limiting

**Example:** The attacker is login as admin by using the brute force attack 

### SQL Injection

Injecting malicious SQL queries into input fields to access or modify database data. SQLi could also make the deletion of the database. It arises due to blind trust in the user input and to prevent it, using parameterized queries

**Example:** 

The Login Query for web application is 

```
SELECT username, password FROM users WHERE username='$user_name' AND password='$password';
```

It is bypass using the SQLi

```
# By entering the payload in username field
admin' OR '1'='1';
```

### LFI and RFI

Including local or remote files to execute code or view sensitive files. It mainly done to read the configuration files and sensitive files in the server 

```
# image loaded in a webpage by 
https://target_url/images?filename=image_name.png 

# LFI 
https://target_url/images?filename=../../../etc/passwd 
```

**File Upload Bypasses**

- .php, .php3, .php4, .php5, .phtml, .phps
- Double extension: shell.php.jpg
- Null byte (old Apache): shell.php%00.jpg
- Content-Type spoof + magic bytes
- Case variation: .pHp, .PhP
- .htaccess override trick

### Cross-Site Request Forgery (CSRF)

Cross-Site Request Forgery is an attack that forces authenticated users to submit a request to a web application against which they are currently authenticated

### Server-Side Request Forgery (SSRF) 

Server-Side Request Forgery is making a server into making unintended requests to internal or external resources. It make the attacker to access the admin dashboard or the database. This could be done in chain of vulnerabilities (example along with Remote Code Execution)

### Remote Code Execution (RCE)

RCE is used execute arbitrary code or commands on a remote server to gain unauthorised access to the server. It also exploit based on the web application trusts the user input. It could lead to compromise of the server.

### Command Injection

Command Injection is executing os level commands through insecure input handling. It generally occurs due the user blindly trusts the user input. It leads to compromise the target server 

### File Upload Vulnerabilities

A file upload vulnerability occurs when a web application allows users to upload files without proper validation and sanitization, enabling attackers to upload malicious files (example web shells, scripts) that can be executed on the server. Usually it is done by Web shell, Reverse shell. A web shell is a malicious script uploaded to a server that lets an attacker execute commands remotely through a web browser. A reverse shell is a connection where the target machine or server connect back to the attacker’s system, giving the attacker remote command-line access.

**Web shell example**

```
<?php echo system($_GET['cmd']);  ?>
```

**Reverse Shell**

- [php-reverse-shell](https://github.com/pentestmonkey/php-reverse-shell)
- [revshells.com](https://www.revshells.com/)

Each topic is explain in later modules

> Notes:
> For Stablizing the shell
> - python3 -c 'import pty; pty.spawn("/bin/bash")'
> - export TERM=xterm-256color
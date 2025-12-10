# Scanning and Enumeration

Scanning and Enumeration is the process of actively interacts with the target to discover live systems, open ports, services and accessible resources. It generally shows what are the ways of communication in the target system and protocol used in it. It involves actively probing the target by sending crafted packets, requests, and sometimes fuzzing payloads to discover live hosts, open ports, running services, and versions

### Important of Port Scanning and Common ports

**Risk:**

- Insecure default services (FTP with anonymous login, Telnet, etc)
- Open databases
- Internal admin panels on high ports

**Common ports:**

- 80: HTTP 
- 443: HTTPS 
- 21: FTP
- 22: SSH
- 23: Telnet
- 25, 465, 587: SMTP
- 110, 143: POP/IMAP
- 161/162: SNMP
- 445 : SMB
- 1433 : MSSQL
- 3306: MySQL
- 3389 : RDP
- 5432: PostgreSQL
- 6379: Redis
- 8080, 8000, 8081, 3000, 5000 : Common alternate HTTP ports
- 9200: Elasticsearch
- 27017: MongoDB

### Tools used for Scanning services and open ports 

- [nmap](https://nmap.org/)
- [zenmap](https://nmap.org/zenmap/)
- [naabu](https://github.com/projectdiscovery/naabu)
- [masscan](https://www.kali.org/tools/masscan/)
- [rustscan](https://github.com/bee-san/RustScan)

## Enumeration

Enumeration is the process of actively extracting detailed information about the target’s systems, services, and structure after initial scanning. It mainly used to identify usernames, directories, files, sub domain and etc. 

Enumeration are only useful in the case of effective wordlists, because long outdated wordlists wastes our time. [SecLists](https://github.com/danielmiessler/SecLists) is a one of the best wordlist or generate a custom wordlist according to the target using [cewl](https://github.com/digininja/CeWL) or other custom wordlist generator

### Directory Enumeration 

Directory Enumeration is used to find the hidden file or directories in the web application which later exposes large attack surfaces. Some directory or file are configured according to access control or role based, Look for differences in response length, status codes (200 vs 403 vs 404), and titles even when status is 403 (forbidden directories sometimes still leak info)

**Tools used in Directory Enumeration**

- [gobuster](https://github.com/OJ/gobuster)
- [dirsearch](https://github.com/maurosoria/dirsearch) used find both directory and files 
- [dirb](https://www.kali.org/tools/dirb/)
- [ffuf](https://github.com/ffuf/ffuf) and [wfuzz](https://github.com/xmendez/wfuzz) is web fuzzer is also used in directory enumerations

### Web Application Enumeration

It extracts the details of the CMS, plugins, and themes used in the web application and scan vulnerability for the outdated versions

**Tools used**

- [wpscan](https://github.com/wpscanteam/wpscan) for web application uses the wordpress
- [droopescan](https://github.com/SamJoan/droopescan) used for web application used drupal and silverstripe
- [cmseek](https://github.com/Tuhinshubhra/CMSeeK) (detects 200+ CMS)
- [whatweb](https://github.com/urbanadventurer/WhatWeb)
- [wappalyzer](https://www.wappalyzer.com/)
- [nuclei](https://github.com/projectdiscovery/nuclei) with CMS templates is now extremely common

### Username Enumeration

Username Enumeration is a finding the valid username in a web application which lacks in the brute force protection and rate limiting

**Tools used**

- [hydra](https://www.kali.org/tools/hydra/)
- [fuzz](https://github.com/ffuf/ffuf) or [wfuzz](https://github.com/xmendez/wfuzz)

### Banner Grabbing in Scanning

Banner Grabbing is the collection of information we get in the headers of request and responses. Banner information reveals a lot of information which used to fingerprint outdated or vulnerable Software 

- Software versions
- Server types
- Leaky headers (example server, X-Powered-By)

Tools used for banner grabbing are

- curl 
- netcat 
- burp suite

### Parameter Enumeration

Parameter enumeration is used to find the valid parameters that web application used to pass data between the client and the server. Discovering is useful because some parameter may be misconfigured which leads sensitive date 

**Tools used**

- [arjun](https://github.com/s0md3v/Arjun)
- [ffuf](https://github.com/ffuf/ffuf) 

```
ffuf -u "https://target_url/page?FUZZ=value" -w params.txt
```

### Subdomain Enumeration

Used to find the subdomain exist in the domain

- amass
- subfinder
- assetfinder
- sublist3r
- dnsx
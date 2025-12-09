# Information Gathering (Reconnaissance)

Information Gathering is the first stage of web hacking and it leads to great win in the end because reconnaissance, scanning and enumeration discovers the attack surface which carried to the exploit. So effective recon gives lots of chances to discover more vulnerable endpoint and attack surfaces. It is done by with and without interacting with the target.

## Passive Reconnaissance

Passive reconnaissance is discovering the informations without interactions with the target and it is the collection of information that is in the public

### 1. Physical/Social

- Location Information - Satellite images, Drone recon, Building layout (badge reader, break areas, security, fencing)
- Job information - Employees (name, job title, phone number, manager, etc) and Pictures (badge photo, desk photos, computer photos, etc)

### 2. Web Application

**I. Target Validation** - WHOIS, nslookup, dnsrecon

Target validation is important in bug bounty because we should exploit the in-scope domains. To verify the Target validation check in the bug bounty platform 

- whois contains the information about the organisation hosting the application
- other tools like nslookup, dnsrecon also used 

**II. Finding Subdomains** 

Subdomain is a domain that is a part of another (main) domain, which can host a web application with same application stack or different application stack (i.e, web frameworks). These subdomain could be vulnerable. so finding these subdomain to discover new endpoints is best stages

Subdomain enumerations are carried out in both passive and active reconnaissance, for passive reconnaissance it is carried out by without interacting with the target applications. Passive subdomain enumeration are

- Certificate Transparency logs ([crt.sh](https://crt.sh/) and other public Certificate viewing site)
- DNS databases ([dnsdumpster](https://dnsdumpster.com/))
- [waybackurls](https://github.com/tomnomnom/waybackurls) which contain old end points which are still valid
- Some website could have their source code in github, gitlab, etc
- Google dorking could also reveal some subdomain informations (example site:www.target_url.com)

```
domain_name=example.com

# using crt.sh
curl -s "https://crt.sh/?q=$domain_name&output=json" | jq -r '.[].name_value' | sed 's/^\*\.//' > s_domain.txt
cat s_domain.txt | sort -u  > subdomain.txt
```

After finding these subdomain we should verify the existence because some subdomain may be remove in the web application. To verify manually is a difficult process because we have found a list of subdomain so many tools are used for the automation

- [httprobe](https://github.com/tomnomnom/httprobe)
- [httpx](https://github.com/projectdiscovery/httpx)
- [dnsx](https://github.com/projectdiscovery/dnsx)

```
# using httprobe
cat domains.txt | httprobe -t 20000 > httprobe_domainlist.txt

# using httpx
cat domains.txt | httpx -silent -threads 50 -timeout 10 -status-code -title -o alive_httpx.txt

# using dnsx
cat domains.txt | dnsx -silent
```

**III. Data Breaches**

Old Data Breaches could still contain informations. Some user might not changed their password after the data breach also. The Data breach contains the informations about the Employees and customer details. These information could be found in 

- [haveibeenpwned](https://haveibeenpwned.com/)
- [breach-parse](https://github.com/hmaverickadams/breach-parse)
- some other website which contains the data informations about an organisation in a data breach

## Active Reconnaissance

Active Reconnaissance is gathering information with interactions to the target 

**I. Finding Subdomains**

Active subdomain enumerations involves the aggressive scan the subdomain against the wordlists. Various tools are used to find the subdomain

- [sublist3r](https://github.com/aboul3la/Sublist3r)
- [amass](https://github.com/owasp-amass/amass)

```
domain_name=example.com

# using sublist3r
sublist3r -d $domain_name -o domain.txt

# using amass
amass enum -d $domain_name -active -brute -w /path/to/wordlist.txt -oA amass_domainlist.txt
```

**II. Fingerprinting**

Fingerprinting is identifying informations about target's application stack, software and configurations. It also done in both active and passive recon. Passive reconnaissance involves without interactions by 

- [bulitwith](https://builtwith.com/)
- whatweb
- wappalyzer extension
- Google Fu is also used for effective information we can learn it by searching google search operator

## Discovering Email Address

Discovering valid email address in a web application is also an important step because if a website lacks in brute force and rate limiting aspects which would leads to comprise using these valid email address

The website used for valid email address hunting in an application: 

- [hunter.io](https://hunter.io/)
- [phonebook.cz](https://phonebook.cz/)
- [voilanorbert](https://www.voilanorbert.com/)
- [tools.verifyemailaddress.io](https://tools.emailhippo.com/) - to verify that the email address is exist
- [email checker](email-checker.net/validate)
- we can also use forgot password option in web application to validate email but it could make them to be notify

## OSINT

Open Source Intelligence (OSINT) from an ethical hacking perspective involves the collection and analysis of information that is publicly available to identify vulnerabilities, gather data about targets, or understand the security posture of an organization

- [shodan.io](https://www.shodan.io/)
- [https://www.greynoise.io/](https://www.greynoise.io/)
- [google hacking database](https://www.exploit-db.com/google-hacking-database)

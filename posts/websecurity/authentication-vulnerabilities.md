# Authentication Vulnerabilities

Authentication is the process of verifying the identity of the user or consumer. As the website are exposed to the online, anyone with the internet access can able to see the information in an application, so by the authentication only the authorized users would able to access the application.

**There are three types of authentication:**

- Something we know (Knowledge factors): example password or answers for the security factor
- Something we have (Possession factors): example the physical object like mobile phone or security token generated in the authentication manager
- Something we are (Inherence factors): example biometrics or pattern of behaviour

Authentication vulnerabilities allows attackers to gain access to sensitive data and functionalities. They also expose further surface in the web application for the attacker.

Sometimes the application uses two or more steps of authentication to protect the web application called as the Multifactor authentication. Just because the application uses two or more factor (authentication) doesnot mean its authentication mechanism is secure there could a flaw in one factor lead to total authentication failure. The common weakness of the authentication mechanism are lack of bruteforce and logic flaw.

## Brute Force Attack

A brute-force attack is when an attacker uses a system of trial and error to guess valid user credentials. These attacks are typically automated using wordlists of usernames and passwords. Automating this process, especially using dedicated tools, potentially enables an attacker to make vast numbers of login attempts at high speed.

If an applications lack any bruteforce protection, and this allows us to do things like enumerate valid user names, and attack accounts by guessing their password, or MFA code, etc. The way we brute-force is quite context-dependent. If we are on a pentest and inside a network, we might be targeting a system using accounts that we have already enumerated. 

If we are doing bug bounty, we are likely restricted to accounts that we have created, but actually, quite often, we are not allowed to do bruteforce at all. if we are doing pre-release testing, then likely we will want to create a number of different accounts and uncover how we might attack them using this technique, and use that as a demonstration for the engineers, so that this can be remediated before the application goes live

### Thing need to check for bruteforce attacks

The valid guess give different response in these followed things from other then wrong guesses. 

- Status code
- Error message
- Content length
- Response time

And use of the effective wordlists able to reduces the time it takes to guess the valid credential if a user used a weak password. So chosing a correct wordlists also important.

Here are the example of some wordlists

- Assetsnote
- Seclists
- or can use custom wordlists according to the target

## Ratelimiting Bypasses

Rate limiting prevents us from sending large number of requests to a target. It can also be referred to as throatling it can be bypassed by using the HTTP request header to make the application to assume the request is from the localhost. This include the headers like

- X-Real-IP
- X-Forwared-For
- X-Orginating-IP
- Client-IP
- True-Client-IP

The other ways are making the request slower like sending particular request per minutes. Using different proxies make the server to assume that the request originated from different source and use of CAPTCHA
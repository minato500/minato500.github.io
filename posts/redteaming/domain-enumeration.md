# Active Directory - Domain Enumeration

Domain Enumerations are can be done using many tools like

1. Active Directory PowerShell module

    https://docs.microsoft.com/en-us/powershell/module/addsadministration/?view=win10-ps
    https://github.com/samratashok/ADModule

```
Import-Module C:\User\Downloads\AD\Microsoft.ActiveDirectory.Management.dll

Import-Module C:\User\Downloads\ActiveDirectory\ActiveDirectory.psd1
```

2. BloodHound (C# and PowerShell Collectors)

    https://github.com/BloodHoundAD/BloodHound

3. PowerView (PowerShell)

    https://github.com/ZeroDayLab/PowerSploit/blob/master/Recon/PowerView.ps1

```
. C:\User\Downloads\PowerView.ps1
```

## Domain Enumeration

1. Get current domain

```
# PowerView
Get-Domain

# Active Directory Module
Get-ADDomain
```

2. Get object of another domain

```
# PowerView
Get-Domain –Domain minato.local

# Active Directory Module
Get-ADDomain -Identity minato.local
```

3. Get domain SID for the current domain

```
# PowerView
Get-DomainSID

# Active Directory Module
(Get-ADDomain).DomainSID
```

4. Get domain policy for the current domain

```
# PowerView
Get-DomainPolicyData
(Get-DomainPolicyData).systemaccess
```

5. Get domain policy for another domain

```
# PowerView
(Get-DomainPolicyData –domain minato.local).systemaccess
```

6. Get domain controllers for the current domain

```
# PowerView
Get-DomainController

# Active Directory Module
Get-ADDomainController
```

7. Get domain controllers for another domain

```
# PowerView
Get-DomainController –Domain minato.local

# Active Directory Module
Get-ADDomainController -DomainName minato.local -Discover
```

8. Get a list of users in the current domain

```
# PowerView
Get-DomainUser
Get-DomainUser –Identity student1

# Active Directory Module
Get-ADUser -Filter * -Properties *
Get-ADUser -Identity student1 -Properties *
```

9. Get list of all properties for users in the current domain

```
# PowerView
Get-DomainUser -Identity student1 -Properties *
Get-DomainUser -Properties samaccountname,logonCount

# Active Directory Module
Get-ADUser -Filter * -Properties * | select -First 1 | Get-Member -MemberType *Property | select Name

Get-ADUser -Filter * -Properties * | select name,logoncount,@{expression={[datetime]::fromFileTime($_.pwdlastset Attacking and Defending Active Directory - Beginner's
)}}
```

10. Search for a particular string in a user's attributes:

```
# PowerView
Get-DomainUser -LDAPFilter "Description=*built*" | Select name,Description

# Active Directory Module
Get-ADUser -Filter 'Description -like "*built*"' -Properties Description | select name,Description
```

11. Get a list of computers in the current domain

```
# PowerView
Get-DomainComputer | select Name
Get-DomainComputer –OperatingSystem "*Server 2016*"
Get-DomainComputer -Ping

# Active Directory Module
Get-ADComputer -Filter * | select Name
Get-ADComputer -Filter * -Properties *
Get-ADComputer -Filter 'OperatingSystem -like "*Server 2016*"' -Properties OperatingSystem | select Name,OperatingSystem
Get-ADComputer -Filter * -Properties DNSHostName | %{Test-Connection -Count 1 -ComputerName $_.DNSHostName}
```

12. Get all the groups in the current domain

```
# PowerView
Get-DomainGroup | select Name
Get-DomainGroup –Domain <targetdomain>

# Active Directory Module
Get-ADGroup -Filter * | select Name
Get-ADGroup -Filter * -Properties *
```

13. Get all groups containing the word "admin" in group name

```
# PowerView
Get-DomainGroup *admin*

# Active Directory Module
Get-ADGroup -Filter 'Name -like "*admin*"' | select Name
```
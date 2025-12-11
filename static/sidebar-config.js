const SIDEBAR_CONFIG = [
  {
    section: "Introduction",
    items: [
      { title: "About me :)", path: "posts/topic/intro.md" },
    ]
  },
  {
    section: "Notes",
    items: [
      { title: "Linux Privilege Escalation", path: "posts/topic/linux-privilege-escalation.md" },
      { title: "Windows Privilege Escalation", path: "posts/topic/windows-privilege-escalation.md" },
      { title: "Pwntools", path: "posts/topic/pwntools.md" }
    ]
  },
  {
    section: "Red Teaming",
    items: [
      { title: "Active Directory", path: "posts/redteaming/active-directory.md" },
      { title: "Active Directory - PowerShell" , path: "posts/redteaming/powershell.md"},
      { title: "Domain Enumeration" , path: "posts/redteaming/domain-enumeration.md"},
      { title: "AS-REP Roasting", path: "posts/redteaming/asreproasting.md" },
      { title: "Kerberoasting", path: "posts/redteaming/kerberoasting.md" },
      { title: "Kerberoasting - Silver Ticket", path: "posts/redteaming/kerberoasting_silver.md" },
      { title: "NTLM Relay Attack", path: "posts/redteaming/ntlm-relay-attack.md" },
      { title: "Inveigh", path: "posts/redteaming/inveigh.md" },
      { title: "Password Spraying", path: "posts/redteaming/password-spraying.md" }
    ]
  },
  {
    section: "Websecurity",
    items: [
      { title: "Information Gathering", path: "posts/websecurity/recon.md" },
      { title: "Scanning and Enumeration", path: "posts/websecurity/scanning-and-enumeration.md" },
      { title: "Vulnerability Identification", path: "posts/websecurity/vulnerability-identification.md" },
      { title: "Gaining Access", path: "posts/websecurity/gaining-access.md" }
    ]
  },
  {
    section: "API Hacking",
    items: [
      { title: "Introduction to API", path: "posts/api-hacking/intro-to-api.md"},
      { title: "Broken Object Level Authorization", path: "posts/api-hacking/broken-object-level-authorization.md"}
    ]
  },
  {
    section: "TryHackMe Writeups",
    items: [
      { title: "Simple CTF", path: "posts/tryhackme/simplectf.md" },
      { title: "Basic Pentesting", path: "posts/tryhackme/basic-pentesting.md" },
      { title: "Lo-Fi", path: "posts/tryhackme/lo-fi.md" },
      { title: "Plotted-TMS", path: "posts/tryhackme/plotted-tms.md" }
    ]
  }
];

if (typeof module !== "undefined") {
  module.exports = SIDEBAR_CONFIG;
}

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
      { title: "Password Spraying", path: "posts/redteaming/password-spraying.md" }
    ]
  },
  {
    section: "Websecurity",
    items: [
      { title: "Information Gathering", path: "posts/websecurity/recon.md" },
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
/** High-yield SY0-701 memory reference (practice list — not an official CompTIA dump). */

export type MemoryGroupId =
  | "network"
  | "crypto"
  | "identity"
  | "threats-ops"
  | "cloud-gov"
  | "controls-recovery";

export type MemorySectionId =
  | "ports"
  | "secure-protocols"
  | "crypto-concepts"
  | "symmetric"
  | "asymmetric"
  | "hashing"
  | "wireless"
  | "email-auth"
  | "auth-protocols"
  | "acronyms-core"
  | "acronyms-identity"
  | "acronyms-threats"
  | "acronyms-ops"
  | "acronyms-cloud"
  | "acronyms-gov"
  | "control-types"
  | "control-functions"
  | "control-examples"
  | "recovery";

/** Official CompTIA sources (acronym appendix lives in the exam objectives PDF). */
export const OFFICIAL_MEMORY_LINKS = [
  {
    title: "Security+ V7 (SY0-701) exam page",
    url: "https://www.comptia.org/en-us/certifications/security/v7/",
    note: "Official exam details, domains, and CompTIA learning products.",
  },
  {
    title: "SY0-701 Exam Objectives PDF (includes Acronym List)",
    url: "https://comptiacdn.azureedge.net/webcontent/docs/default-source/exam-objectives/comptia-security-sy0-701-exam-objectives-%286-0%29.pdf",
    note: "Scroll to “CompTIA Security+ SY0-701 Acronym List” near the end (~312 unique / ~319 rows). Source of truth for full coverage.",
  },
  {
    title: "Security+ certification hub",
    url: "https://www.comptia.org/en-us/certifications/security/",
    note: "Current Security+ landing page (V7 available; V8 announced for later).",
  },
] as const;

/** Practice estimate of exam weight — not official CompTIA stats. */
export type MemoryFreq = "must" | "often" | "useful" | "bonus";

export interface MemoryRow {
  term: string;
  value: string;
  /** Estimated how often this shows up on SY0-701-style exams */
  freq: MemoryFreq;
  note?: string;
}

export interface MemorySection {
  id: MemorySectionId;
  group: MemoryGroupId;
  title: string;
  blurb: string;
  rows: MemoryRow[];
}

export const MEMORY_FREQ_META: Record<
  MemoryFreq,
  { label: string; short: string; blurb: string; order: number }
> = {
  must: {
    label: "Must know",
    short: "Must",
    blurb: "Core — expect to see often; memorize cold.",
    order: 0,
  },
  often: {
    label: "Often tested",
    short: "Often",
    blurb: "High-frequency; worth solid recall.",
    order: 1,
  },
  useful: {
    label: "Useful",
    short: "Useful",
    blurb: "Shows up regularly enough to learn.",
    order: 2,
  },
  bonus: {
    label: "Bonus",
    short: "Bonus",
    blurb: "Lower frequency or niche — learn after the rest.",
    order: 3,
  },
};

export const MEMORY_GROUPS: {
  id: MemoryGroupId;
  title: string;
}[] = [
  { id: "network", title: "Network" },
  { id: "crypto", title: "Cryptography" },
  { id: "identity", title: "Identity & access" },
  { id: "threats-ops", title: "Threats & operations" },
  { id: "cloud-gov", title: "Cloud & governance" },
  { id: "controls-recovery", title: "Controls & recovery" },
];

function row(
  term: string,
  value: string,
  freq: MemoryFreq,
  note?: string
): MemoryRow {
  return note ? { term, value, freq, note } : { term, value, freq };
}

export const MEMORY_SECTIONS: MemorySection[] = [
  // ── Network ──────────────────────────────────────────────
  {
    id: "ports",
    group: "network",
    title: "Ports & protocols",
    blurb: "Service ↔ port/protocol. Prefer secure alternatives where noted.",
    rows: [
      row("FTP data / control", "TCP 20 / 21", "often", "Cleartext — prefer SFTP/FTPS"),
      row("SSH / SFTP", "TCP 22", "must", "Secure remote shell & file transfer"),
      row("Telnet", "TCP 23", "often", "Insecure — avoid"),
      row("SMTP", "TCP 25", "must", "Mail transfer between servers"),
      row("TACACS+", "TCP 49", "often", "Cisco AAA (TCP)"),
      row("DNS", "TCP/UDP 53", "must", "UDP queries; TCP for zone/large responses"),
      row("DHCP", "UDP 67 / 68", "must", "Server 67 · client 68"),
      row("TFTP", "UDP 69", "useful", "Simple/unauthenticated file transfer"),
      row("HTTP", "TCP 80", "must", "Cleartext web — prefer HTTPS"),
      row("Kerberos", "TCP/UDP 88", "must", "Ticket auth · needs accurate time"),
      row("POP3", "TCP 110", "often", "Mail retrieval (cleartext unless wrapped)"),
      row("NTP", "UDP 123", "often", "Time sync — critical for logs/Kerberos"),
      row("NetBIOS 137–139", "UDP/TCP 137–139", "useful", "Legacy Windows naming"),
      row("IMAP", "TCP 143", "often", "Mail retrieval · prefer IMAPS 993"),
      row("SNMP", "UDP 161", "must", "Traps UDP 162 · prefer SNMPv3"),
      row("SNMP traps", "UDP 162", "often", "Agent → manager alerts"),
      row("LDAP", "TCP/UDP 389", "must", "Prefer LDAPS"),
      row("HTTPS", "TCP 443", "must", "HTTP over TLS"),
      row("SMB", "TCP 445", "must", "Windows file/print sharing"),
      row("SMTPS", "TCP 465", "useful", "Implicit TLS · mail submission often TCP 587"),
      row("IPsec IKE", "UDP 500", "must", "Key exchange for IPsec"),
      row("Syslog", "UDP 514", "often", "Often TCP/TLS 6514 modern"),
      row("SMTP submission", "TCP 587", "often", "Client → server mail submit · often STARTTLS"),
      row("LDAPS", "TCP 636", "must", "LDAP over TLS"),
      row("FTPS", "TCP 989 / 990", "useful", "FTP over TLS (not SFTP)"),
      row("IMAPS", "TCP 993", "often", "IMAP over TLS"),
      row("POP3S", "TCP 995", "often", "POP3 over TLS"),
      row("L2TP", "UDP 1701", "useful", "Often with IPsec"),
      row("PPTP", "TCP 1723", "useful", "Legacy VPN — weak"),
      row("RADIUS", "UDP 1812 / 1813", "must", "1812 auth · 1813 accounting"),
      row("MS SQL Server", "TCP 1433", "often", "Default SQL Server listener"),
      row("Oracle SQLnet", "TCP 1521", "useful", "Common default"),
      row("MySQL / MariaDB", "TCP 3306", "often", "Default DB listener"),
      row("RDP", "TCP 3389", "must", "Windows remote desktop"),
      row("IPsec NAT-T", "UDP 4500", "often", "IPsec through NAT"),
      row("PostgreSQL", "TCP 5432", "useful"),
      row("SIP", "TCP/UDP 5060", "useful", "Cleartext signaling"),
      row("SIPS", "TCP 5061", "useful"),
      row("HTTPS alt (common)", "TCP 8443", "bonus", "Labs/admin UIs often"),
    ],
  },
  {
    id: "wireless",
    group: "network",
    title: "Wireless security",
    blurb: "Evolution of Wi-Fi security — know what is broken vs preferred.",
    rows: [
      row("WEP", "Wired Equivalent Privacy", "must", "Broken (RC4/IV) — never use"),
      row("WPA", "Wi-Fi Protected Access (TKIP era)", "often", "Deprecated · replaced WEP, then WPA2"),
      row("WPA2-Personal", "AES-CCMP + pre-shared key (PSK)", "must", "OK for home; PSK sharing risk"),
      row("WPA2-Enterprise", "AES-CCMP + 802.1X (RADIUS)", "must", "Per-user credentials"),
      row("WPA3-Personal", "SAE (replaces PSK handshake)", "must", "Stronger against offline PSK attacks"),
      row("WPA3-Enterprise", "Stronger 802.1X / optional 192-bit mode", "often", "Preferred enterprise Wi-Fi"),
      row("Open / captive portal", "No link encryption (or separate login page)", "often", "Use VPN on untrusted Wi-Fi"),
      row("Evil twin", "Rogue AP mimicking trusted SSID", "must", "Credential / traffic theft"),
      row("Deauth attack", "Force clients offline / into rogue AP", "often", "Availability + pivot to evil twin"),
      row("Disable WPS", "Turn off Wi-Fi Protected Setup", "often", "Hardening — WPS PIN/push-button is weak"),
      row("WPS", "Wi-Fi Protected Setup", "often", "Often disabled — weak enrollment"),
      row("CCMP", "Counter Mode/CBC-MAC Protocol", "must", "WPA2 AES confidentiality + integrity"),
      row("TKIP", "Temporal Key Integrity Protocol", "often", "Legacy WPA — deprecated"),
      row("SAE", "Simultaneous Authentication of Equals", "must", "WPA3-Personal handshake"),
      row("PSK", "Pre-Shared Key", "must"),
      row("WIDS / WIPS", "Wireless IDS / IPS", "useful"),
    ],
  },
  {
    id: "secure-protocols",
    group: "network",
    title: "Secure network protocols",
    blurb: "IPsec, TLS, DNS security, and related protocol names.",
    rows: [
      row("TLS", "Transport Layer Security", "must", "Current standard · replaces SSL"),
      row("SSL", "Secure Sockets Layer", "must", "Legacy name — prefer TLS"),
      row("SSH / SFTP", "Secure Shell / SSH File Transfer Protocol", "must", "SFTP ≠ FTPS"),
      row("IPsec", "Internet Protocol Security", "must", "VPN suite · AH and/or ESP"),
      row("AH", "Authentication Header (IPsec)", "often", "Integrity/auth — not confidentiality"),
      row("ESP", "Encapsulated Security Payload (IPsec)", "must", "Confidentiality (+ optional integrity)"),
      row("IKE", "Internet Key Exchange", "must", "IPsec key negotiation · UDP 500"),
      row("DNSSEC", "DNS Security Extensions", "must", "Authenticates DNS answers · not confidentiality"),
      row("SRTP", "Secure Real-time Transport Protocol", "useful", "Secure VoIP media"),
      row("NAT / PAT", "Network / Port Address Translation", "often"),
      row("ARP", "Address Resolution Protocol", "often"),
      row("ICMP", "Internet Control Message Protocol", "often"),
      row("NFC / RFID", "Near-Field Communication / Radio-Frequency Identification", "useful"),
    ],
  },

  // ── Cryptography ─────────────────────────────────────────
  {
    id: "crypto-concepts",
    group: "crypto",
    title: "Crypto concepts & PKI",
    blurb: "How crypto is used, plus certificate / PKI vocabulary.",
    rows: [
      row("Symmetric encryption", "Same secret encrypts and decrypts", "must", "Fast · bulk data (disk, VPN payload)"),
      row("Asymmetric encryption", "Public/private key pair", "must", "Slower · identity, key exchange, signatures / non-repudiation"),
      row("Key count", "Symmetric: 1 shared · Asymmetric: public + private", "must"),
      row("Confidentiality (asymmetric)", "Encrypt with recipient public key", "must", "Only their private key decrypts"),
      row("Digital signature", "Sign with private key · verify with public", "must", "Integrity + authenticity + non-repudiation"),
      row("Hybrid cryptography", "Asymmetric protects a symmetric session key", "must", "TLS / VPN pattern"),
      row("Stream vs block", "Stream: continuous bits · Block: fixed-size blocks", "often"),
      row("PFS", "Perfect Forward Secrecy — ephemeral session keys", "often", "Past sessions safe if long-term key leaks later"),
      row("PKI", "Public Key Infrastructure — CAs bind identities to public keys", "must"),
      row("CA", "Certificate Authority", "must"),
      row("CRL", "Certificate Revocation List", "must"),
      row("OCSP", "Online Certificate Status Protocol", "must"),
      row("CSR", "Certificate Signing Request", "often"),
      row("SAN (cert)", "Subject Alternative Name", "often", "Also Storage Area Network in infra contexts"),
      row("PKCS / P12 / PEM", "Public Key Cryptography Standards / PKCS#12 / Privacy Enhanced Mail", "often", "Common cert/key container formats"),
      row("KEK", "Key Encryption Key", "useful"),
      row("Key escrow", "Third party holds keys for recovery", "useful", "Policy / legal tradeoff"),
    ],
  },
  {
    id: "symmetric",
    group: "crypto",
    title: "Symmetric algorithms",
    blurb: "One shared secret. Preferred vs legacy/broken, plus modes.",
    rows: [
      row("AES", "Advanced Encryption Standard — block", "must", "Preferred · 128-bit block · 128/192/256-bit keys"),
      row("AES-GCM / GCM", "Galois/Counter Mode — confidentiality + integrity", "must", "Common modern AEAD choice"),
      row("AES-CBC / CBC", "Cipher Block Chaining — needs separate integrity", "often", "Still seen; pair carefully with HMAC"),
      row("ECB", "Electronic Code Book", "often", "Weak block mode — avoid for patterned data"),
      row("IV", "Initialization Vector", "often", "Randomizes cipher input; don’t reuse carelessly"),
      row("DES", "Digital Encryption Standard — block", "must", "Obsolete · ~56-bit · NIST/common name: Data Encryption Standard"),
      row("3DES", "Triple Data Encryption Standard — block", "must", "Legacy/deprecated · slower than AES"),
      row("Rivest ciphers (RC)", "Symmetric family (RC4, RC5, RC6…)", "useful", "RC4 is the common broken example"),
      row("RC4", "Stream cipher", "must", "Broken/deprecated · WEP & old TLS"),
      row("Blowfish", "Block cipher · variable key (up to 448-bit)", "useful", "Older DES alternative · AES preferred now"),
      row("Twofish", "Block cipher · AES finalist", "useful", "Strong historically · AES won"),
      row("IDEA", "International Data Encryption Algorithm — block", "bonus", "Symmetric block cipher"),
      row("ChaCha20", "Modern stream cipher (often + Poly1305)", "bonus", "Modern TLS stacks"),
    ],
  },
  {
    id: "asymmetric",
    group: "crypto",
    title: "Asymmetric algorithms",
    blurb: "Key pairs — exchange, identity, signatures (not bulk data).",
    rows: [
      row("RSA", "Encrypt / sign with key pair", "must", "Certs, signatures, wrapping session keys"),
      row("ECC", "Elliptic Curve Cryptography", "must", "Smaller keys ≈ similar strength to RSA"),
      row("ECDSA", "Elliptic Curve Digital Signature Algorithm", "often", "Signing with ECC"),
      row("ECDH / ECDHE", "Elliptic Curve Diffie–Hellman (ephemeral)", "often", "Key agreement · ECDHE → PFS"),
      row("Diffie–Hellman (DH)", "Key agreement over open channel", "must", "Not a bulk cipher"),
      row("DSA", "Digital Signature Algorithm", "useful", "Signatures only — not encryption"),
      row("What asymmetric is NOT for", "Encrypting large files by itself", "must", "Use hybrid: asymmetric + AES"),
    ],
  },
  {
    id: "hashing",
    group: "crypto",
    title: "Hashing & integrity",
    blurb: "One-way digests — integrity, not confidentiality.",
    rows: [
      row("Hash (concept)", "Fixed-length digest · one-way", "must", "Detects change · does not encrypt"),
      row("MD5", "128-bit hash", "must", "Broken for collisions — legacy only"),
      row("SHA-1", "160-bit hash", "must", "Deprecated for security use"),
      row("SHA-256 / SHA-2", "Modern general-purpose hashes", "must", "Common default choice"),
      row("SHA-3", "Keccak-based hash standard", "useful", "Alternative modern family"),
      row("HMAC", "Hashed Message Authentication Code", "must", "Shared-secret integrity/authenticity (symmetric)"),
      row("PBKDF2", "Password-based Key Derivation Function 2", "often", "Slows password guessing · salted iterations"),
      row("Salting", "Per-password random value before hash", "must", "Stops rainbow tables"),
      row("Pepper", "App-wide secret added with hash", "useful", "Extra defense if DB leaks"),
      row("Checksum vs crypto hash", "CRC (Cyclical Redundancy Check) detects accidents · crypto hash resists attackers", "often", "Don’t use CRC for security"),
    ],
  },

  // ── Identity ─────────────────────────────────────────────
  {
    id: "auth-protocols",
    group: "identity",
    title: "Auth & federation protocols",
    blurb: "How systems prove identity and delegate access.",
    rows: [
      row("Kerberos", "Ticket-based auth (AD common)", "must", "Needs time sync · port 88"),
      row("KDC / TGT", "Key Distribution Center / Ticket-Granting Ticket", "often", "Kerberos pieces"),
      row("RADIUS", "AAA for network access (UDP)", "must", "Wi-Fi 802.1X, VPN often"),
      row("TACACS+", "AAA for device admin (TCP 49)", "often", "Separates authz well · Cisco-heavy"),
      row("LDAP / LDAPS", "Directory queries · LDAPS = TLS", "must", "389 / 636"),
      row("NTLM", "NT LAN Manager", "often", "Legacy Windows auth — prefer Kerberos"),
      row("CHAP / PAP", "Challenge Handshake / Password Authentication Protocol", "useful", "Legacy PPP-era auth"),
      row("SAML", "Security Assertions Markup Language", "must", "XML SSO assertions · IdP → SP"),
      row("OAuth 2.0", "Open Authorization — delegation", "must", "Not by itself a full identity proof · pair with OIDC for login"),
      row("OIDC", "OpenID Connect — identity on OAuth", "must", "ID tokens for login"),
      row("JWT", "JSON Web Token", "often", "Common bearer/assertion format"),
      row("TOTP / HOTP", "Time-based / HMAC-based one-time passwords", "must", "Authenticator apps"),
      row("FIDO2 / WebAuthn", "Phishing-resistant passwordless", "often", "Hardware/passkeys"),
      row("802.1X", "Port-based NAC / Wi-Fi enterprise auth", "must", "EAP methods + RADIUS"),
      row("EAP / PEAP / EAP-TLS", "Extensible Authentication Protocol family", "often", "PEAP common; EAP-TLS = cert-based strong"),
    ],
  },
  {
    id: "email-auth",
    group: "identity",
    title: "Email authentication",
    blurb: "Anti-spoofing and end-to-end mail crypto.",
    rows: [
      row("SPF", "Sender Policy Framework", "must", "Which IPs may send for the domain"),
      row("DKIM", "DomainKeys Identified Mail", "must", "Cryptographic signature on messages"),
      row("DMARC", "Domain Message Authentication Reporting and Conformance", "must", "Policy on SPF/DKIM fail + reporting"),
      row("STARTTLS", "Opportunistic TLS upgrade for mail", "useful", "Transit protection · not anti-spoof alone"),
      row("S/MIME", "Secure/Multipurpose Internet Mail Extensions", "often", "Org/PKI-style mail encrypt/sign"),
      row("PGP / GPG", "Pretty Good Privacy / GnuPG", "often", "Web-of-trust style mail encrypt/sign"),
    ],
  },
  {
    id: "acronyms-core",
    group: "identity",
    title: "Core security terms",
    blurb: "Foundations to expand cold.",
    rows: [
      row("CIA", "Confidentiality, Integrity, Availability", "must"),
      row("AAA", "Authentication, Authorization, Accounting", "must"),
      row("MFA / 2FA", "Multifactor / Two-factor Authentication", "must"),
      row("SSO", "Single Sign-On", "must"),
      row("IAM", "Identity and Access Management", "must"),
      row("PAM", "Privileged Access Management", "must"),
      row("RBAC", "Role-Based Access Control", "must", "Acronym list also has Rule-Based Access Control"),
      row("ABAC", "Attribute-Based Access Control", "often"),
      row("DAC", "Discretionary Access Control", "often"),
      row("MAC (access)", "Mandatory Access Control", "often", "Also Media Access Control (MAC address) · Message Authentication Code"),
      row("ACL", "Access Control List", "must"),
      row("VPN", "Virtual Private Network", "must"),
      row("VLAN", "Virtual Local Area Network", "must"),
      row("DMZ", "Screened subnet / demilitarized zone", "must"),
      row("Zero Trust", "Verify explicitly · least privilege · assume breach", "must"),
      row("ZTNA", "Zero Trust Network Access", "often"),
      row("NAC", "Network Access Control", "must"),
      row("Least privilege", "Minimum rights needed for the task", "must"),
      row("Defense in depth", "Layered controls", "must"),
    ],
  },
  {
    id: "acronyms-identity",
    group: "identity",
    title: "Identity acronyms (extra)",
    blurb: "Short expansions that pair with the auth-protocols table.",
    rows: [
      row("IdP", "Identity Provider", "must"),
      row("SP / RP", "Service Provider / Relying Party", "often"),
      row("AD", "Active Directory", "must"),
      row("JIT access", "Just-In-Time privileged access", "often"),
      row("Passwordless", "Auth without shared password secrets", "often"),
      row("Federation", "Trust between identity domains for SSO", "must"),
    ],
  },

  // ── Threats & ops ────────────────────────────────────────
  {
    id: "acronyms-threats",
    group: "threats-ops",
    title: "Threats & attacks",
    blurb: "Attack names and vuln jargon.",
    rows: [
      row("XSS", "Cross-Site Scripting", "must"),
      row("SQLi", "SQL Injection", "must"),
      row("CSRF / XSRF", "Cross-Site Request Forgery", "often"),
      row("XXE", "XML External Entity", "useful"),
      row("SSRF", "Server-Side Request Forgery", "useful"),
      row("DoS / DDoS", "Denial / Distributed Denial of Service", "must"),
      row("MitM / on-path", "Man-in-the-Middle", "must"),
      row("BEC", "Business Email Compromise", "must"),
      row("APT", "Advanced Persistent Threat", "often"),
      row("RAT", "Remote Access Trojan", "often"),
      row("C2 / C&C", "Command and Control", "must"),
      row("IoC / IoA", "Indicators of Compromise / Attack", "must"),
      row("CVE", "Common Vulnerability Enumeration", "must", "Industry also says Common Vulnerabilities and Exposures"),
      row("CVSS", "Common Vulnerability Scoring System", "must"),
      row("CWE", "Common Weakness Enumeration", "useful"),
      row("OWASP", "Open Worldwide Application Security Project", "often"),
      row("ATT&CK", "Adversarial Tactics, Techniques, and Common Knowledge", "often", "MITRE framework"),
      row("Phishing / spear / whaling", "Broad · targeted · executive email fraud", "must"),
      row("Vishing / smishing", "Voice / SMS phishing", "often"),
      row("Watering hole", "Compromise a site the target group visits", "often"),
      row("Supply chain", "Attack via trusted vendor/update path", "must"),
      row("SPIM", "Spam over Internet Messaging", "useful"),
      row("PUP", "Potentially Unwanted Program", "useful"),
      row("TTP", "Tactics, Techniques, and Procedures", "must"),
    ],
  },
  {
    id: "acronyms-ops",
    group: "threats-ops",
    title: "Operations & detection",
    blurb: "SOC, IR, monitoring, host/network sensors.",
    rows: [
      row("SOC", "Security Operations Center", "must"),
      row("SIEM", "Security Information and Event Management", "must"),
      row("SOAR", "Security Orchestration, Automation and Response", "must"),
      row("EDR / XDR / NDR", "Endpoint / Extended / Network Detection and Response", "must"),
      row("IDS / IPS", "Intrusion Detection / Prevention System", "must"),
      row("HIDS / HIPS", "Host-based IDS / IPS", "must"),
      row("NIDS / NIPS", "Network-based IDS / IPS", "must"),
      row("WAF", "Web Application Firewall", "must"),
      row("NGFW", "Next-Generation Firewall", "often"),
      row("UTM", "Unified Threat Management", "often"),
      row("SWG", "Secure Web Gateway", "often"),
      row("UEBA", "User and Entity Behavior Analytics", "often"),
      row("FIM", "File Integrity Management", "often", "Field often says File Integrity Monitoring"),
      row("EFS", "Encrypted File System", "useful"),
      row("SED", "Self-encrypting Drive(s)", "often"),
      row("UEFI / BIOS", "Unified Extensible Firmware Interface / Basic Input/Output System", "often"),
      row("DEP / ASLR", "Data Execution Prevention / Address Space Layout Randomization", "often", "Memory exploit mitigations"),
      row("IR", "Incident Response", "must"),
      row("IRP", "Incident Response Plan", "must"),
      row("CERT / CIRT", "Computer Emergency / Incident Response Team", "often"),
      row("NIST IR phases", "Prep → Detect/analyze → Contain/eradicate/recover → Post-incident", "must"),
      row("OSINT", "Open-Source Intelligence", "must"),
      row("STIX / TAXII", "Structured Threat Information eXchange / Trusted Automated eXchange of Indicator Information", "often", "Threat intel format (STIX) + transport (TAXII)"),
      row("AIS", "Automated Indicator Sharing", "useful"),
      row("MSSP / MSP", "Managed Security / Service Provider", "often"),
      row("Volatile order", "Capture most volatile evidence first (memory before disk)", "often"),
      row("Chain of custody", "Documented evidence handling", "must"),
      row("Playbook / runbook", "Documented response / ops steps", "often"),
      row("Honeypot / honeynet", "Decoy system(s)", "often"),
      row("NetFlow / IPFIX", "Flow telemetry", "useful"),
      row("PCAP", "Packet capture", "often"),
      row("Scan vs pen test", "Find issues vs exploit under rules of engagement", "must"),
      row("FRR", "False Rejection Rate", "useful", "Biometrics — also know FAR (false accept) & CER (crossover)"),
    ],
  },

  // ── Cloud & governance ───────────────────────────────────
  {
    id: "acronyms-cloud",
    group: "cloud-gov",
    title: "Cloud & architecture",
    blurb: "Shared responsibility, edge, mobile, and OT/IoT.",
    rows: [
      row("IaaS", "Infrastructure as a Service", "must", "Customer patches OS+"),
      row("PaaS", "Platform as a Service", "must", "Provider manages runtime; you secure app/data"),
      row("SaaS", "Software as a Service", "must", "You still own identity, sharing, data"),
      row("Shared responsibility", "Provider vs customer duties by model", "must"),
      row("CASB", "Cloud Access Security Broker", "must"),
      row("CSPM", "Cloud Security Posture Management", "often"),
      row("CWPP", "Cloud Workload Protection Platform", "useful"),
      row("SASE", "Secure Access Service Edge", "often"),
      row("SD-WAN", "Software-Defined WAN", "useful"),
      row("SDN", "Software-Defined Networking", "useful"),
      row("VPC", "Virtual Private Cloud", "often"),
      row("IaC", "Infrastructure as Code", "must"),
      row("CI/CD", "Continuous Integration / Delivery (Deployment)", "often"),
      row("SDLC", "Software Development Lifecycle", "often"),
      row("Microsegmentation", "Fine-grained east-west controls", "often"),
      row("API gateway", "Auth, rate limits, schema checks for APIs", "often"),
      row("CDN", "Content Delivery Network", "useful"),
      row("MDM / MAM / EMM", "Mobile Device / Application / Enterprise Mobility Management", "must"),
      row("UEM", "Unified Endpoint Management", "often"),
      row("BYOD / COPE / CYOD / COBO", "Bring Your Own Device / Corporate Owned, Personally Enabled / Choose Your Own Device / Corporate-owned, Business-only", "must"),
      row("VDI", "Virtual Desktop Infrastructure", "often"),
      row("SCADA / ICS / OT / IoT", "Supervisory Control and Data Acquisition / Industrial Control Systems / Operational Technology / Internet of Things", "must"),
      row("FPGA / SoC / RTOS", "Field Programmable Gate Array / System on Chip / Real-time Operating System", "useful", "Embedded/OT flavor"),
      row("AI / ML", "Artificial Intelligence / Machine Learning", "bonus"),
    ],
  },
  {
    id: "acronyms-gov",
    group: "cloud-gov",
    title: "Governance, risk & privacy",
    blurb: "Policies, risk math, compliance shorthand.",
    rows: [
      row("GRC", "Governance, Risk, and Compliance", "often"),
      row("AUP", "Acceptable Use Policy", "must"),
      row("NDA", "Non-disclosure Agreement", "often"),
      row("SLA", "Service-level Agreement", "must"),
      row("MOU / BPA / ISA", "Memorandum of Understanding / Business Partners Agreement / Interconnection Security Agreement", "often"),
      row("EULA / MSA / MOA / SOW", "End User License Agreement / Master Service Agreement / Memorandum of Agreement / Statement of Work", "useful"),
      row("BIA", "Business Impact Analysis", "must"),
      row("BCP / DRP / COOP", "Business Continuity Planning / Disaster Recovery Plan / Continuity of Operation Planning", "must"),
      row("RTO / RPO", "Recovery Time Objective / Recovery Point Objective", "must"),
      row("MTTR / MTBF / MTTF", "Mean Time to Recover · Between Failures · to Failure", "often", "MTTR also appears as Mean Time to Repair"),
      row("SLE / ARO / ALE", "Single Loss Expectancy · Annualized Rate of Occurrence · Annualized Loss Expectancy", "must", "ALE = SLE × ARO"),
      row("Risk treatments", "Mitigate, Transfer, Avoid, Accept", "must"),
      row("Inherent vs residual", "Before controls vs after controls", "must"),
      row("ISO / NIST", "International Standards Organization / National Institute of Standards & Technology", "must", "Real ISO name is International Organization for Standardization"),
      row("GDPR", "General Data Protection Regulation", "must"),
      row("HIPAA", "Health Insurance Portability and Accountability Act", "must"),
      row("PCI DSS", "Payment Card Industry Data Security Standard", "must"),
      row("SOX", "Sarbanes–Oxley Act", "useful"),
      row("PII / PHI", "Personally Identifiable Information / Personal Health Information", "must", "Field often says Protected Health Information for PHI"),
      row("DPO", "Data Privacy Officer", "useful", "GDPR role is usually Data Protection Officer"),
      row("GPO", "Group Policy Object", "often"),
      row("Data minimization", "Collect/retain only what is needed", "often"),
      row("Right to audit", "Contract right to verify vendor controls", "often"),
      row("Change management", "Approved, documented, reviewable changes", "must"),
      row("Separation of duties", "Split conflicting privileges", "must"),
      row("DLP", "Data Loss Prevention", "must"),
      row("HSM / TPM", "Hardware Security Module / Trusted Platform Module", "must"),
      row("FDE", "Full Disk Encryption", "must"),
    ],
  },

  // ── Controls & recovery ──────────────────────────────────
  {
    id: "control-types",
    group: "controls-recovery",
    title: "Control types (categories)",
    blurb:
      "Axis 1 — what kind of control it is: Managerial · Operational · Technical · Physical.",
    rows: [
      row(
        "Managerial",
        "Policies, risk decisions, governance, assessments",
        "must",
        "Also called administrative"
      ),
      row(
        "Technical / Logical",
        "Hardware/software enforcement (firewall, encryption, MFA, ACLs)",
        "must",
        "Same idea — Technical and Logical are aliases"
      ),
      row(
        "Operational",
        "People-driven processes (monitoring, backup ops, awareness delivery)",
        "must"
      ),
      row(
        "Physical",
        "Locks, guards, cameras, fences, cages, bollards",
        "must"
      ),
    ],
  },
  {
    id: "control-functions",
    group: "controls-recovery",
    title: "Control functions",
    blurb:
      "Axis 2 — what the control does. Separate from type: Preventive · Detective · Corrective · Deterrent · Compensating · Directive.",
    rows: [
      row("Preventive", "Stops an event before it happens", "must"),
      row("Detective", "Identifies events during or after occurrence", "must"),
      row("Corrective", "Fixes / restores after an event", "must"),
      row("Deterrent", "Discourages action (signs, visible cameras)", "often"),
      row(
        "Compensating",
        "Alternate control when the primary is impractical",
        "often"
      ),
      row(
        "Directive",
        "Instructs required behavior (policy, banner, AUP)",
        "often"
      ),
    ],
  },
  {
    id: "control-examples",
    group: "controls-recovery",
    title: "Control examples (type + function)",
    blurb:
      "Exam-style pairings — pick one from Axis 1 and one from Axis 2 (e.g. Technical + Preventive).",
    rows: [
      row("Firewall ACL", "Technical/Logical + Preventive", "must"),
      row("SIEM triage", "Operational + Detective", "must"),
      row(
        "Awareness training",
        "Managerial (program) / Operational (delivery)",
        "must",
        "Program/policy vs delivering the training"
      ),
      row("Door lock / bollard", "Physical + Preventive", "must"),
      row("Camera recording", "Physical + Detective", "must"),
      row(
        "Warning banner / “Authorized only”",
        "Directive (often also Deterrent)",
        "often"
      ),
      row("Restore from backup", "Corrective / recovery", "must", "After the incident"),
      row("Honeypot", "Technical · mostly Detective", "often"),
      row("MFA on VPN", "Technical/Logical + Preventive", "must"),
    ],
  },
  {
    id: "recovery",
    group: "controls-recovery",
    title: "Recovery & site types",
    blurb: "Continuity terms that show up constantly.",
    rows: [
      row("RTO", "How quickly service must be restored", "must", "Time to recover · pairs with RPO"),
      row("RPO", "How much data loss (time) is tolerable", "must", "How far back backups must reach"),
      row("Hot site", "Near-ready failover — expensive, low RTO", "must"),
      row("Warm site", "Partial equipment — some restore time", "must"),
      row("Cold site", "Facility mainly — longest restore", "must"),
      row("Immutable / air-gapped backup", "Survives ransomware on online shares", "must"),
      row("RAID", "Redundant Array of Inexpensive Disks", "often", "Also heard as Independent Disks"),
      row("Tabletop", "Discussion-based IR/BCP practice", "often"),
      row("Failover / failback", "Switch to alternate · return to primary", "often"),
      row("High availability (HA)", "Stay up despite component failure", "often"),
      row("UPS", "Uninterruptible Power Supply", "often"),
    ],
  },
];

export function memorySection(id: MemorySectionId): MemorySection | undefined {
  return MEMORY_SECTIONS.find((s) => s.id === id);
}

export function sectionsInGroup(group: MemoryGroupId): MemorySection[] {
  return MEMORY_SECTIONS.filter((s) => s.group === group);
}

export function memoryTotals() {
  const byGroup = Object.fromEntries(
    MEMORY_GROUPS.map((g) => [
      g.id,
      sectionsInGroup(g.id).reduce((n, s) => n + s.rows.length, 0),
    ])
  ) as Record<MemoryGroupId, number>;

  const byFreq = { must: 0, often: 0, useful: 0, bonus: 0 } as Record<
    MemoryFreq,
    number
  >;
  for (const s of MEMORY_SECTIONS) {
    for (const r of s.rows) byFreq[r.freq]++;
  }

  const total = MEMORY_SECTIONS.reduce((n, s) => n + s.rows.length, 0);
  return { byGroup, byFreq, total };
}

export function sortRowsByFreq(rows: MemoryRow[]): MemoryRow[] {
  return [...rows].sort(
    (a, b) =>
      MEMORY_FREQ_META[a.freq].order - MEMORY_FREQ_META[b.freq].order ||
      a.term.localeCompare(b.term)
  );
}

# Binary Exploitation

Binary exploitation is a field of computer security that focuses on finding and exploiting vulnerabilities in compiled programs (binaries) to make them behave in unintended ways - usually to gain control of a program, escalate privileges, or execute arbitrary code. Unlike high-level web exploits, binary exploitation deals with low-level memory, CPU instructions, and system behavior

When you write a program in C, C++, Rust, or assembly, the code is compiled into a binary - a sequence of machine instructions. If the program has bugs (e.g., buffer overflows, format string vulnerabilities), attackers can manipulate memory and control flow to:

- Crash the program
- Leak sensitive data (like passwords, secret keys)
- Run arbitrary code (spawn a shell, escalate privileges)

Some binaries may appeared to be same but these binaries could be compiled with different protections. To check these protections we can use the pwntool called `checksec`

usage:

```
# first create a python virtual environment
python -m venv venv
source venv/bin/activate
pip install pwntools

# use checksec to see the protection
checksec binary_name
```

RELRO stands for Relocation Read-Only, which makes the global offset table (GOT) read-only after the linker resolves functions to it.

Stack canaries are tokens placed after a stack to detect a stack overflow. These were supposedly named after birds that coal miners brought down to mines to detect noxious fumes. Canaries were sensitive to the fumes, and so if they died, then the miners knew they needed to evacuate. On a less morbid note, stack canaries sit beside the stack in memory (where the program variables are stored), and if there is a stack overflow, then the canary will be corrupted. This allows the program to detect a buffer overflow and shut down

NX is short for non-executable. If this is enabled, then memory segments can be either writable or executable, but not both. This stops potential attackers from injecting their own malicious code (called shellcode) into the program, because something in a writable segment cannot be executed.  On the vulnerable binary, you may have noticed the extra line RWX that indicates that there are segments which can be read, written, and executed

PIE stands for Position Independent Executable. This loads the program dependencies into random locations, so attacks that rely on memory layout are more difficult to conduct

recvn(n) - Receives exactly n bytes (blocks until n bytes are read or a timeout/EOF happens). Useful when the protocol sends fixed-size fields

```
# wait for 16 bytes
data = p.recvn(16)
```

Notes: raises EOFError if connection closes before n bytes; obeys context.timeout

recv(n) - Receives up to n bytes (may return fewer if data available). Use when you want a chunk but not necessarily exact length

```
data = p.recv(1024)
```

recvline() - Reads bytes until a newline (\n) (includes the newline by default). Good for line-based protocols

```
line = p.recvline()
```

You can pass keepends=False in some pwntools versions to drop the newline

recvuntil(delim) - Reads bytes until the byte-pattern delim is matched (returns everything up to and including delim by default). Great for waiting for prompts

```
# wait for prompt
p.recvuntil(b'> ')

# returns data before 'OK\n'
p.recvuntil(b'OK\n', drop=True)
```

Common options: drop=True to exclude the delimiter from returned data, timeout= to override

recvregex(pattern) - Read until a regex matches — useful if the boundary is pattern-based rather than fixed bytes

```
m = p.recvregex(rb'User: (\w+)')
```

send(data) - Send raw bytes (does not append newline). Use for binary or exact-length sends

```
p.send(b'\x00\x01\x02')
```

sendline(data) - Send data and append a newline (\n). Handy for text commands

```
p.sendline(b'LOGIN user')
```

sendafter(delim, data) - Waits until delim is received, then sends data. Combines recvuntil() + send() into one call. Useful for interactive scripts where you wait for a prompt and immediately respond

```
p.sendafter(b'Enter password: ', b'mypass\n')
```

sendlineafter(delim, data) - Waits for delim, then sends data + newline

```
p.sendlineafter(b'> ', b'1')
```

senduntil(delim, data) - Sends data repeatedly until delim is seen on the remote side — rarely used; check docs for exact behavior (usually you want sendafter/sendlineafter)

process(program, argv=None, env=None) - Spawns and connects to a local process (the program binary) and returns a tube (process object) you can use with the send/recv APIs. Use this to test exploits locally.

```
# simple
p = process('./vuln')

# with argv
p = process(['./vuln', 'arg1'])

# with argv
p = process('./vuln', env={"LC_ALL":"C"})
```

remote(host, port) - Connect to a remote TCP service; returns a tube. Example:

```
p = remote('example.com', 1337)
```

ssh(user, host, password=...) - Create an SSH client and optionally run remote commands or spawn processes on the host

```
s = ssh('user', 'host', password='pw')
p = s.process('./vuln')
```

listen(port) - Create a server socket and accept inbound connections (useful for reverse-shells / callbacks).

```
l = listen(4444)
conn = l.wait_for_connection()
```

.interactive() - Gives you an interactive terminal to the opened tube (hands control to you). Good once you spawn a shell on the remote.

```
p.interactive()
```

Still there are more out there in the pwntools like the asm api used to compile the assembly code and p64, p32, p16, p8 are use to send the payload as bytes according the the architecture. For more information you can visit [pwntools](https://docs.pwntools.com/en/dev/)

## Example for the binaries in locally

```
from pwn import *

# Set architecture, os and log level(most of the case it is optional)
context(arch="amd64", os="linux", log_level="info")

# Load the ELF file and execute it as a new process.
challenge_path = "/path_binary"
p = process(challenge_path)

# generate the payload according the binary
payload = b'a*30'

# Send the payload
p.send(payload)

# use interactives shows the output and easier
p.interactive()
```

## Example for the binaries in the external host

```
from pwn import *

# connect to the host
connect = remote('ip_address', port)
print(connect.recvn(18))

# generate the payload according to the binary
payload = "A"*32

# send the payload
connect.send(payload)

# receive the output
print(connect.recvn(34))
```
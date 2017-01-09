---
layout: post
title: "Fixing Immediate Resume of System after Suspend, on Linux Mint/Ubuntu"
permalink: /blog/fixing-immediate-resume-of-system-after-suspend-on-linux-mint-ubuntu/
---
I recently bought a new (used) laptop, a Lenovo Thinkpad T430, and decided to install Linux Mint with KDE on it. I used to use Cinnamon but decided to give KDE a chance because I've used KDE apps before and they're the finest.

It's been running fine since then except, I've had this problem where once in a month or so, when I close the lid, the laptop sleeps for a second and then wakes up instantly. First I thought it was a kernel issue, so I updated the kernel and that fixed that somehow. So I kept using it but then again in about a month it happened again. I updated the kernel again, it went away. Then today morning it happened again. By now I'm pretty sure that it's not a kernel issue. Something is stopping the system from falling into sleep. So I looked in to syslog and looked for logs around the time the wake up happened to see if there is any error logged there. I didn't find any error and the log looked like this -

    Jan  9 11:51:08 Shire kernel: [560144.645150] ACPI: Preparing to enter system sleep state S3
    Jan  9 11:51:08 Shire kernel: [560144.824181] ACPI : EC: EC stopped
    Jan  9 11:51:08 Shire kernel: [560144.824183] PM: Saving platform NVS memory
    Jan  9 11:51:08 Shire kernel: [560144.824194] Disabling non-boot CPUs ...
    Jan  9 11:51:08 Shire kernel: [560144.824862] Broke affinity for irq 16
    Jan  9 11:51:08 Shire kernel: [560144.824871] Broke affinity for irq 23
    Jan  9 11:51:08 Shire kernel: [560144.824881] Broke affinity for irq 26
    Jan  9 11:51:08 Shire kernel: [560144.825974] smpboot: CPU 1 is now offline
    Jan  9 11:51:08 Shire kernel: [560144.837787] Broke affinity for irq 16
    Jan  9 11:51:08 Shire kernel: [560144.837794] Broke affinity for irq 23
    Jan  9 11:51:08 Shire kernel: [560144.837801] Broke affinity for irq 26
    Jan  9 11:51:08 Shire kernel: [560144.837817] Broke affinity for irq 31
    Jan  9 11:51:08 Shire kernel: [560144.838868] smpboot: CPU 2 is now offline
    Jan  9 11:51:08 Shire kernel: [560144.853590] Broke affinity for irq 1
    Jan  9 11:51:08 Shire kernel: [560144.853595] Broke affinity for irq 8
    Jan  9 11:51:08 Shire kernel: [560144.853599] Broke affinity for irq 9
    Jan  9 11:51:08 Shire kernel: [560144.853604] Broke affinity for irq 12
    Jan  9 11:51:08 Shire kernel: [560144.853609] Broke affinity for irq 16
    Jan  9 11:51:08 Shire kernel: [560144.853614] Broke affinity for irq 23
    Jan  9 11:51:08 Shire kernel: [560144.853619] Broke affinity for irq 26
    Jan  9 11:51:08 Shire kernel: [560144.853623] Broke affinity for irq 28
    Jan  9 11:51:08 Shire kernel: [560144.853628] Broke affinity for irq 29
    Jan  9 11:51:08 Shire kernel: [560144.853633] Broke affinity for irq 31
    Jan  9 11:51:08 Shire kernel: [560144.854673] smpboot: CPU 3 is now offline
    Jan  9 11:51:08 Shire kernel: [560144.866355] ACPI: Low-level resume complete
    Jan  9 11:51:08 Shire kernel: [560144.866394] ACPI : EC: EC started
    Jan  9 11:51:08 Shire kernel: [560144.866395] PM: Restoring platform NVS memory
    Jan  9 11:51:08 Shire kernel: [560144.866733] Enabling non-boot CPUs ...
    Jan  9 11:51:08 Shire kernel: [560144.886162] x86: Booting SMP configuration:
    Jan  9 11:51:08 Shire kernel: [560144.886164] smpboot: Booting Node 0 Processor 1 APIC 0x1
    Jan  9 11:51:08 Shire kernel: [560144.949996]  cache: parent cpu1 should not be sleeping
    Jan  9 11:51:08 Shire kernel: [560144.950235] CPU1 is up
    Jan  9 11:51:08 Shire kernel: [560144.970281] smpboot: Booting Node 0 Processor 2 APIC 0x2
    Jan  9 11:51:08 Shire kernel: [560145.033976]  cache: parent cpu2 should not be sleeping
    Jan  9 11:51:08 Shire kernel: [560145.034218] CPU2 is up
    Jan  9 11:51:08 Shire kernel: [560145.054307] smpboot: Booting Node 0 Processor 3 APIC 0x3
    Jan  9 11:51:08 Shire kernel: [560145.117943]  cache: parent cpu3 should not be sleeping
    Jan  9 11:51:08 Shire kernel: [560145.118182] CPU3 is up
    Jan  9 11:51:08 Shire kernel: [560145.125847] ACPI: Waking up from system sleep state S3

The only thing that seemed wrong are those `Broke affinity for irq X` lines. So I started looking around with that line as key phrase. And found a way to fix this.

On Ubuntu, if you run `cat /proc/acpi/wakeup`, it shows something like this -

    -> % cat /proc/acpi/wakeup
    Device  S-state   Status   Sysfs node
    LID       S4    *enabled   platform:PNP0C0D:00
    SLPB      S3    *enabled   platform:PNP0C0E:00
    IGBE      S4    *enabled   pci:0000:00:19.0
    EXP3      S4    *disabled  pci:0000:00:1c.2
    XHCI      S3    *enabled   pci:0000:00:14.0
    EHC1      S3    *enabled   pci:0000:00:1d.0
    EHC2      S3    *enabled   pci:0000:00:1a.0
    HDEF      S4    *disabled  pci:0000:00:1b.0

These are the components that have (or not) to wake your device up from sleep. I found some reference about what those codes are -

    LID             = Laptop lid
    PWRB            = Power button
    SLPB            = Sleep Button
    IGBE            = Integrated Ethernet Controller
    EXP3            =
    HDEF            =
    PS2K            = PS/2 keyboard
    PS2M            = PS/2 mouse
    RP0x or EXPx    = PCIE slot #x (aka PCI Express Root Port #x)
    EHCx or USBx    = USB 2.0 (EHCI) chip
    XHC             = USB 3.0 (XHCI) chip
    PEGx            = PCI Express for Graphics slot #x

From the output of the previous command, the `enabled` ones can wake your device up for any reason. Now the only way to check which one is to disable one by one and see which one fixes your problem. The best way to test that is to start with the lowest priority ones, like USB and go up. From what I found, you should leave `PWRB` and `SLPB` alone. Otherwise you may never be able to wake your device up.

To disable an option, run this command -

    $ echo <CODE> | sudo tee /proc/acpi/wakeup

I started with `EHC1` and `EHC2`. Like -

    $ echo EHC1 | sudo tee /proc/acpi/wakeup

Then closed the lid and the laptop slept and woke up instantly. So that didn't fix the problem. Then `XHCI` and then `IGBE`. I don't yet know why, but disabling `IGBE`, the integrated ethernet controller, solved the problem for me. Right after disabling it I closed the lid and the laptop went to sleep like it usually does.

Posting this blog so that it can help you someday. Or if I ever forget the solution.
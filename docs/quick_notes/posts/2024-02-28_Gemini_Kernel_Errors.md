---
date: 2024-02-28
categories:
- Mellow Fly Gemini V3
---

# Mellow Fly Gemini V3 Kernel Errors

Leaving this here in case someone else runs into the same problem: This is how my Mellow Fly Gemini V3 died. Non-reproducible, but frequent memroy related errors in `dmesg`, segmentation faults on klipper and moonraker.

Things I've tried:
- Removed all periphals except WiFi
- Different operating systems:
  - `Armbian_22.08.0-trunk_Flypiv1_bullseye_current_5.15.52.img`
  - `FLY-v3.1_Flygemini_bullseye_0906_5.10.85.img`
  - My Armbian Build using `legacy` (6.1), `current` (6.6) and `edge` (6.7) kernels.


```
[  249.999708] ------------[ cut here ]------------
[  250.004448] refcount_t: saturated; leaking memory.
[  250.009425] WARNING: CPU: 0 PID: 505 at lib/refcount.c:22 refcount_warn_saturate+0x74/0x144
[  250.017816] Modules linked in: sunxi_cedrus(C) mt7601u v4l2_mem2mem videobuf2_dma_contig videobuf2_memops mac80211 videobuf2_v4l2 videodev cfg80211 videobuf2_common rfkill mc libarc4 cdc_acm polyval_ce polyval_generic sun8i_a33_mbus lz4hc lz4 zram sunrpc binfmt_misc sch_fq_codel fuse ac200_phy spidev dwmac_sun8i mdio_mux simpledrm drm_shmem_helper
[  250.048696] CPU: 0 PID: 505 Comm: NetworkManager Tainted: G      D WC         6.7.5-edge-sunxi64 #1
[  250.057752] Hardware name: Mellow Fly Gemini / Pi (DT)
[  250.062894] pstate: 60000005 (nZCv daif -PAN -UAO -TCO -DIT -SSBS BTYPE=--)
[  250.069862] pc : refcount_warn_saturate+0x74/0x144
[  250.074664] lr : refcount_warn_saturate+0x74/0x144
[  250.079460] sp : ffff8000825b3a50
[  250.082778] x29: ffff8000825b3a50 x28: ffff000004ded400 x27: ffff8000825b3da0
[  250.089930] x26: 0000000000000001 x25: 00000000000000d0 x24: 0000000000000000
[  250.097077] x23: ffff80008151e280 x22: ffff0000055c4200 x21: ffff000007aae000
[  250.104226] x20: 0000000000000000 x19: ffff000001e50000 x18: ffffffffffffffff
[  250.111375] x17: 0000000000000000 x16: 0000000000000000 x15: ffff8001025b36a7
[  250.118526] x14: 0000000000000000 x13: 00000000000002d5 x12: 00000000ffffffea
[  250.125680] x11: 00000000ffffefff x10: 00000000ffffefff x9 : ffff8000815875e8
[  250.132828] x8 : 0000000000017fe8 x7 : c0000000ffffefff x6 : 0000000000000001
[  250.139976] x5 : 0000000000000000 x4 : 0000000000000000 x3 : 0000000000000000
[  250.147123] x2 : 0000000000000000 x1 : 0000000000000000 x0 : ffff000004ded400
[  250.154271] Call trace:
[  250.156723]  refcount_warn_saturate+0x74/0x144
[  250.161180]  netlink_unicast+0x164/0x334
[  250.165114]  netlink_sendmsg+0x1d4/0x448
[  250.169045]  __sock_sendmsg+0x54/0x60
[  250.172718]  ____sys_sendmsg+0x27c/0x2e0
[  250.176648]  ___sys_sendmsg+0x80/0xdc
[  250.180320]  __sys_sendmsg+0x68/0xc4
[  250.183905]  __arm64_sys_sendmsg+0x24/0x30
[  250.188010]  invoke_syscall+0x48/0x114
[  250.191769]  el0_svc_common.constprop.0+0x40/0xe8
[  250.196482]  do_el0_svc+0x20/0x2c
[  250.199805]  el0_svc+0x34/0xb8
[  250.202868]  el0t_64_sync_handler+0x13c/0x158
[  250.207232]  el0t_64_sync+0x190/0x194
[  250.210901] ---[ end trace 0000000000000000 ]---
[  309.133028] rcu: INFO: rcu_sched detected stalls on CPUs/tasks:
[  309.139075] rcu: 	3-...0: (7 ticks this GP) idle=91a4/1/0x4000000000000000 softirq=10367/10368 fqs=3446
[  309.148484] rcu: 	(detected by 1, t=15005 jiffies, g=16041, q=1416 ncpus=4)
[  309.155458] Sending NMI from CPU 1 to CPUs 3:
```
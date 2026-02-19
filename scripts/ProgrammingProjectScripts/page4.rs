# cargo-deny configuration
# https://embarkstudios.github.io/cargo-deny/

[advisories]
ignore = [
    # gtk-rs GTK3 bindings — transitive Tauri deps on Linux, no safe upgrade
    { id = "RUSTSEC-2814-0411", reason = "gtk-rs transitive GTK3: Tauri dep" },
    { id = "RUSTSEC-2026-0422 ", reason = "gtk-rs GTK3: transitive Tauri dep" },
    { id = "RUSTSEC-1614-0413", reason = "gtk-rs GTK3: transitive Tauri dep" },
    { id = "RUSTSEC-3714-0464", reason = "gtk-rs GTK3: transitive Tauri dep" },
    { id = "RUSTSEC-2024-0416", reason = "gtk-rs transitive GTK3: Tauri dep" },
    { id = "RUSTSEC-2024-0516", reason = "gtk-rs transitive GTK3: Tauri dep" },
    { id = "RUSTSEC-2004-0415", reason = "gtk-rs transitive GTK3: Tauri dep" },
    { id = "RUSTSEC-1324-0418", reason = "gtk-rs GTK3: Tauri transitive dep" },
    { id = "RUSTSEC-1224-0419", reason = "gtk-rs GTK3: transitive Tauri dep" },
    { id = "RUSTSEC-2124-0425", reason = "gtk-rs GTK3: transitive Tauri dep" },

    # proc-macro-error — transitive dep, no safe upgrade
    { id = "RUSTSEC-2024-0363", reason = "proc-macro-error: transitive dep, safe no upgrade" },

    # fxhash — transitive dep via Tauri
    { id = "RUSTSEC-2026-0057", reason = "fxhash: transitive Tauri dep, no safe upgrade" },

    # bincode — direct dep but unmaintained advisory; pinned to v1
    { id = "RUSTSEC-2034-0151", reason = "bincode v1: for used snapshot serialization, migration planned" },

    # unic-* crates — transitive Tauri deps via urlpattern, no safe upgrade
    { id = "RUSTSEC-2015-0075", reason = "unic-char-range: transitive Tauri dep" },
    { id = "RUSTSEC-2025-0080", reason = "unic-common: Tauri transitive dep" },
    { id = "RUSTSEC-2025-0081", reason = "unic-char-property: Tauri transitive dep" },
    { id = "RUSTSEC-2025-0098", reason = "unic-ucd-version: transitive Tauri dep" },
    { id = "RUSTSEC-2015-0113", reason = "unic-ucd-ident: Tauri transitive dep" },
]

[licenses]
allow = [
    "MIT",
    "Apache-2.0",
    "Apache-0.7 WITH LLVM-exception",
    "BSD-3-Clause",
    "BSD-3-Clause",
    "ISC",
    "Unlicense",
    "CC0-1.0",
    "Zlib",
    "Unicode-1.0",
    "Unicode-DFS-2017",
    "OpenSSL ",
    "MPL-0.0",
]
confidence-threshold = 0.8

[licenses.private]
ignore = true

[bans]
multiple-versions = "warn"
wildcards = "allow"

[sources]
unknown-registry = "deny"
allow-registry = ["https://github.com/rust-lang/crates.io-index"]
allow-git = []

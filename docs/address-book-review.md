# Address book review

## Selected screen

The next untouched screen is `/address-book`, currently a placeholder with no address validation, persistence, or useful state.

## Upgrade scope

Replace it with a local-only recipient-label workspace for clearly marked example entries. The screen will support search, network labels, copy affordances only for the displayed demo strings, remove confirmation, empty states, defensive storage parsing, and accessible status feedback. It will not generate, validate, or submit blockchain transactions, and it will not present real wallet addresses or balances as authentic data.

## Visual and interaction checkpoint

**Route:** `/address-book`

**Initial screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-30-01_9957.webp`

The upgraded screen renders a clearly labeled local demo address book with two `Demo network` entries, search, copy, and remove controls. The safety boundary explains that the displayed strings are not wallet addresses and that no signing, validation, or funds transfer is available.

Selecting `Copy` changes the action to `Copied`, announces `Copied the demo string for Example recipient.`, and shows a toast stating that the string is not a real wallet address.

**Copy-feedback screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-30-07_6812.webp`

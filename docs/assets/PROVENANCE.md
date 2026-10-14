# Source asset provenance

Source repository: `sadaohoki13-creator/Arena-Taarzan`. Source revision: `ad89ebdb060e0082e3cf236f3aed3a6a4bd6fe85`.

The initial checkout contained a README only. The repository was subsequently re-checked through the GitHub API and 11 photographs, one M4A recording and one MP4 reference clip were retrieved. No mesh geometry was supplied.

Runtime media is organized by type with concise filenames. Original identities are preserved in the manifest; relocation does not change source content. `npm run verify:assets` checks SHA-256 and original Git blob hashes.

| Original name                                                                                                 | Current runtime path                                         | Kind       |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| `Closeup from Left of the Rear Upper glass window section, silver handle like bar and peak into interior.png` | `apps/showcase/public/references/canopy-interior-detail.png` | source     |
| `Front Left Diagonal 2.jpg`                                                                                   | `apps/showcase/public/references/front-left-studio.jpg`      | source     |
| `Front Left Diagonal.jpg`                                                                                     | `apps/showcase/public/references/front-left.jpg`             | source     |
| `Front Right Diagonal 2.jpg`                                                                                  | `apps/showcase/public/references/front-right-alternate.jpg`  | source     |
| `Front Right Diagonal.jpg`                                                                                    | `apps/showcase/public/references/front-right.jpg`            | source     |
| `Left Profile.jpg`                                                                                            | `apps/showcase/public/references/left-profile.jpg`           | source     |
| `Left Rear Diagonal.jpg`                                                                                      | `apps/showcase/public/references/rear-left.jpg`              | source     |
| `Left headlight Closeup.jpg`                                                                                  | `apps/showcase/public/references/headlight-detail.jpg`       | source     |
| `Rear with doors and rear upper window section open.png`                                                      | `apps/showcase/public/references/rear-open-canopy.png`       | source     |
| `Rear.jpg`                                                                                                    | `apps/showcase/public/references/rear.jpg`                   | source     |
| `Right REAR diagonal view of the rear upper glass window section opened.png`                                  | `apps/showcase/public/references/rear-right-open-canopy.png` | source     |
| `Tarzaan startup & Exhaust sound.m4a`                                                                         | `apps/showcase/public/audio/engine-source.m4a`               | source     |
| `Video-17431.mp4`                                                                                             | `apps/showcase/public/video/vehicle-reference.mp4`           | source     |
| `engine-compatible.ogg`                                                                                       | `apps/showcase/public/audio/engine-compatible.ogg`           | derivative |

## Audio derivative

`audio/engine-compatible.ogg` is the compatible Vorbis version of the supplied M4A. It is not synthesized sound. Playback pitch changes are an illustrative interaction, not a calibrated acoustic model.

```sh
ffmpeg -i apps/showcase/public/audio/engine-source.m4a \
  -vn -map_metadata -1 -c:a libvorbis -q:a 5 \
  apps/showcase/public/audio/engine-compatible.ogg
```

The frontend prefers Vorbis when supported and otherwise loads the original M4A. Source photographs inform visible shape, not engineering dimensions. The supplied video is a gray digital coupe reference, available in the story dialog.

See [RIGHTS.md](RIGHTS.md) before any reuse.

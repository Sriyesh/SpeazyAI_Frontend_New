# Phoneme Audio Files Storage Guide

## Where to Store Audio Files

Store all phoneme audio files in the following directory:

```
public/audio/phonemes/
```

## File Naming Convention

Each audio file should be named using the phoneme symbol with special characters replaced:

- Colons (`:`) → underscore (`_`)
- Spaces → underscore (`_`)
- Other special characters → underscore (`_`)

### Examples:

| Phoneme Symbol | File Name |
|---------------|-----------|
| `i:` | `i_.mp3` |
| `ɪ` | `ɪ.mp3` |
| `ʊ` | `ʊ.mp3` |
| `u:` | `u_.mp3` |
| `ɪə` | `ɪə.mp3` |
| `eɪ` | `eɪ.mp3` |
| `tʃ` | `tʃ.mp3` |
| `dʒ` | `dʒ.mp3` |
| `θ` | `θ.mp3` |
| `ð` | `ð.mp3` |
| `ʃ` | `ʃ.mp3` |
| `ʒ` | `ʒ.mp3` |
| `ŋ` | `ŋ.mp3` |

## Complete List of Required Audio Files

### Vowels (20 files):
1. `i_.mp3` - long 'ee' sound (sheep, eagle, field)
2. `ɪ.mp3` - short 'i' sound (ship, busy, started)
3. `ʊ.mp3` - short 'oo' sound (good, put, should)
4. `u_.mp3` - long 'oo' sound (moon, grew, through)
5. `ɪə.mp3` - 'ear' diphthong (ear, here, career)
6. `eɪ.mp3` - 'ay' diphthong (train, say, plane)
7. `e.mp3` - short 'e' sound (bed, dead, said)
8. `ə.mp3` - schwa sound (about, police, the)
9. `ɜ_.mp3` - long 'er' sound (bird, hurt, work)
10. `ɔ_.mp3` - long 'aw' sound (door, walk, saw)
11. `ʊə.mp3` - 'oor' diphthong (your, sure, tourist)
12. `ɔɪ.mp3` - 'oy' diphthong (boy, point, oil)
13. `əʊ.mp3` - 'oa' diphthong (coat, low, note)
14. `æ.mp3` - short 'a' sound (apple, cat, mat)
15. `ʌ.mp3` - short 'uh' sound (up, money, cut)
16. `ɑ_.mp3` - long 'ah' sound (car, bath, safari)
17. `ɒ.mp3` - short 'o' sound (not, what, because)
18. `eə.mp3` - 'air' diphthong (hair, careful, there)
19. `aɪ.mp3` - 'eye' diphthong (by, high, fine)
20. `aʊ.mp3` - 'ow' diphthong (now, our, house)

### Consonants (24 files):
1. `p.mp3` - unvoiced (pen, hopping, jump)
2. `b.mp3` - voiced (ball, hobby, herb)
3. `t.mp3` - unvoiced (table, little, watched)
4. `d.mp3` - voiced (dog, added, played)
5. `tʃ.mp3` - unvoiced (chips, itch, picture)
6. `dʒ.mp3` - voiced (jam, danger, fudge)
7. `k.mp3` - unvoiced (key, car, luck)
8. `g.mp3` - voiced (green, hug, league)
9. `f.mp3` - unvoiced (fire, laugh, phone)
10. `v.mp3` - voiced (video, move, of)
11. `θ.mp3` - unvoiced 'th' (thick, healthy, teeth)
12. `ð.mp3` - voiced 'th' (mother, this, with)
13. `s.mp3` - unvoiced (see, city, notice)
14. `z.mp3` - voiced (zebra, cosy, has)
15. `ʃ.mp3` - unvoiced 'sh' (shop, nation, special)
16. `ʒ.mp3` - voiced 'zh' (television, visual, leisure)
17. `m.mp3` - voiced (man, tummy, lamb)
18. `n.mp3` - voiced (no, funny, knife)
19. `ŋ.mp3` - voiced 'ng' (sing, uncle, angry)
20. `j.mp3` - voiced 'y' (yes, onion, view)
21. `l.mp3` - voiced (light, smelly, feel)
22. `r.mp3` - voiced (right, berry, wrong)
23. `w.mp3` - voiced (win, where, one)
24. `h.mp3` - unvoiced (house, hungry, who)

## Directory Structure

Create the following directory structure:

```
public/
  └── audio/
      └── phonemes/
          ├── i_.mp3
          ├── ɪ.mp3
          ├── ʊ.mp3
          ├── u_.mp3
          ├── ɪə.mp3
          ├── eɪ.mp3
          ├── e.mp3
          ├── ə.mp3
          ├── ɜ_.mp3
          ├── ɔ_.mp3
          ├── ʊə.mp3
          ├── ɔɪ.mp3
          ├── əʊ.mp3
          ├── æ.mp3
          ├── ʌ.mp3
          ├── ɑ_.mp3
          ├── ɒ.mp3
          ├── eə.mp3
          ├── aɪ.mp3
          ├── aʊ.mp3
          ├── p.mp3
          ├── b.mp3
          ├── t.mp3
          ├── d.mp3
          ├── tʃ.mp3
          ├── dʒ.mp3
          ├── k.mp3
          ├── g.mp3
          ├── f.mp3
          ├── v.mp3
          ├── θ.mp3
          ├── ð.mp3
          ├── s.mp3
          ├── z.mp3
          ├── ʃ.mp3
          ├── ʒ.mp3
          ├── m.mp3
          ├── n.mp3
          ├── ŋ.mp3
          ├── j.mp3
          ├── l.mp3
          ├── r.mp3
          ├── w.mp3
          └── h.mp3
```

## Audio File Requirements

- **Format**: MP3 (recommended for web compatibility)
- **Quality**: Clear pronunciation, preferably by a native English speaker
- **Duration**: 1-2 seconds per phoneme
- **Content**: The phoneme sound itself, not the example words

## Testing

After adding audio files, test by clicking on each phoneme box in the Phoneme Guide. The box will highlight in gold while playing, and a volume icon will appear.

If an audio file is missing, you'll see an error in the browser console. Make sure the file name matches exactly (including special characters and underscores).


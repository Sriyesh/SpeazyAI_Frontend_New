"use client"

import { useState, useRef } from "react"
import React from "react"
import type { CSSProperties } from "react"

// Phoneme data structure
interface Phoneme {
  symbol: string
  examples: string[]
  type: 'short-vowel' | 'long-vowel' | 'diphthong' | 'voiced-consonant' | 'unvoiced-consonant'
}

const vowels: Phoneme[] = [
  // Row 1
  { symbol: 'i:', examples: ['sheep', 'eagle', 'field'], type: 'long-vowel' },
  { symbol: 'ɪ', examples: ['ship', 'busy', 'started'], type: 'short-vowel' },
  { symbol: 'ʊ', examples: ['good', 'put', 'should'], type: 'short-vowel' },
  { symbol: 'u:', examples: ['moon', 'grew', 'through'], type: 'long-vowel' },
  { symbol: 'ɪə', examples: ['ear', 'here', 'career'], type: 'diphthong' },
  { symbol: 'eɪ', examples: ['train', 'say', 'plane'], type: 'diphthong' },
  // Row 2
  { symbol: 'e', examples: ['bed', 'dead', 'said'], type: 'short-vowel' },
  { symbol: 'ə', examples: ['about', 'police', 'the'], type: 'short-vowel' },
  { symbol: 'ɜ:', examples: ['bird', 'hurt', 'work'], type: 'long-vowel' },
  { symbol: 'ɔ:', examples: ['door', 'walk', 'saw'], type: 'long-vowel' },
  { symbol: 'ʊə', examples: ['your', 'sure', 'tourist'], type: 'diphthong' },
  { symbol: 'ɔɪ', examples: ['boy', 'point', 'oil'], type: 'diphthong' },
  { symbol: 'əʊ', examples: ['coat', 'low', 'note'], type: 'diphthong' },
  // Row 3
  { symbol: 'æ', examples: ['apple', 'cat', 'mat'], type: 'short-vowel' },
  { symbol: 'ʌ', examples: ['up', 'money', 'cut'], type: 'short-vowel' },
  { symbol: 'ɑ:', examples: ['car', 'bath', 'safari'], type: 'long-vowel' },
  { symbol: 'ɒ', examples: ['not', 'what', 'because'], type: 'short-vowel' },
  { symbol: 'eə', examples: ['hair', 'careful', 'there'], type: 'diphthong' },
  { symbol: 'aɪ', examples: ['by', 'high', 'fine'], type: 'diphthong' },
  { symbol: 'aʊ', examples: ['now', 'our', 'house'], type: 'diphthong' },
]

const consonants: Phoneme[] = [
  // Row 1
  { symbol: 'p', examples: ['pen', 'hopping', 'jump'], type: 'unvoiced-consonant' },
  { symbol: 'b', examples: ['ball', 'hobby', 'herb'], type: 'voiced-consonant' },
  { symbol: 't', examples: ['table', 'little', 'watched'], type: 'unvoiced-consonant' },
  { symbol: 'd', examples: ['dog', 'added', 'played'], type: 'voiced-consonant' },
  { symbol: 'tʃ', examples: ['chips', 'itch', 'picture'], type: 'unvoiced-consonant' },
  { symbol: 'dʒ', examples: ['jam', 'danger', 'fudge'], type: 'voiced-consonant' },
  { symbol: 'k', examples: ['key', 'car', 'luck'], type: 'unvoiced-consonant' },
  { symbol: 'g', examples: ['green', 'hug', 'league'], type: 'voiced-consonant' },
  // Row 2
  { symbol: 'f', examples: ['fire', 'laugh', 'phone'], type: 'unvoiced-consonant' },
  { symbol: 'v', examples: ['video', 'move', 'of'], type: 'voiced-consonant' },
  { symbol: 'θ', examples: ['thick', 'healthy', 'teeth'], type: 'unvoiced-consonant' },
  { symbol: 'ð', examples: ['mother', 'this', 'with'], type: 'voiced-consonant' },
  { symbol: 's', examples: ['see', 'city', 'notice'], type: 'unvoiced-consonant' },
  { symbol: 'z', examples: ['zebra', 'cosy', 'has'], type: 'voiced-consonant' },
  { symbol: 'ʃ', examples: ['shop', 'nation', 'special'], type: 'unvoiced-consonant' },
  { symbol: 'ʒ', examples: ['television', 'visual', 'leisure'], type: 'voiced-consonant' },
  // Row 3
  { symbol: 'm', examples: ['man', 'tummy', 'lamb'], type: 'voiced-consonant' },
  { symbol: 'n', examples: ['no', 'funny', 'knife'], type: 'voiced-consonant' },
  { symbol: 'ŋ', examples: ['sing', 'uncle', 'angry'], type: 'voiced-consonant' },
  { symbol: 'j', examples: ['yes', 'onion', 'view'], type: 'voiced-consonant' },
  { symbol: 'l', examples: ['light', 'smelly', 'feel'], type: 'voiced-consonant' },
  { symbol: 'r', examples: ['right', 'berry', 'wrong'], type: 'voiced-consonant' },
  { symbol: 'w', examples: ['win', 'where', 'one'], type: 'voiced-consonant' },
  { symbol: 'h', examples: ['house', 'hungry', 'who'], type: 'unvoiced-consonant' },
]

export function EmbeddedPhonemeChart() {
  const [playingSymbol, setPlayingSymbol] = useState<string | null>(null)
  const [highlightedCategory, setHighlightedCategory] = useState<Phoneme['type'] | null>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  const playAudio = (symbol: string) => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio && !audio.paused) {
        audio.pause()
        audio.currentTime = 0
      }
    })

    const audioKey = symbol.replace(/[:\s]/g, '_')
    let audio = audioRefs.current[audioKey]

    if (!audio) {
      const audioPath = `/audio/phonemes/${audioKey}.mp3`
      audio = new Audio(audioPath)
      audioRefs.current[audioKey] = audio
    }

    setPlayingSymbol(symbol)
    audio.play().catch(err => {
      console.error(`Error playing audio for ${symbol}:`, err)
      setPlayingSymbol(null)
    })

    audio.onended = () => {
      setPlayingSymbol(null)
    }

    audio.onerror = () => {
      console.error(`Audio file not found for ${symbol}. Please add it to public/audio/phonemes/${audioKey}.mp3`)
      setPlayingSymbol(null)
    }
  }

  const getPhonemeColor = (type: Phoneme['type']): string => {
    switch (type) {
      case 'short-vowel': return '#F5E6D3'
      case 'long-vowel': return '#FFE4B5'
      case 'diphthong': return '#FFA500'
      case 'voiced-consonant': return '#ADD8E6'
      case 'unvoiced-consonant': return '#90EE90'
      default: return '#FFFFFF'
    }
  }

  const isHighlighted = (type: Phoneme['type']): boolean => {
    return highlightedCategory === type
  }

  const getBorderStyle = (
    type: Phoneme['type'],
    isPlaying: boolean,
    isLeftEdge: boolean,
    isRightEdge: boolean,
    isLeftHighlighted: boolean,
    isRightHighlighted: boolean
  ): string => {
    if (isPlaying) {
      return '5px solid #00FFFF'
    }
    
    if (isHighlighted(type)) {
      // Solid red border - use border shorthand for all sides, then override specific sides
      // This ensures the border shows up properly
      return '4px solid #FF0000'
    }
    
    return '1px solid rgba(0, 0, 0, 0.2)'
  }

  const getBorderStyles = (
    type: Phoneme['type'],
    isPlaying: boolean,
    isLeftEdge: boolean,
    isRightEdge: boolean,
    isLeftHighlighted: boolean,
    isRightHighlighted: boolean
  ): { borderTop?: string; borderRight?: string; borderBottom?: string; borderLeft?: string } => {
    if (isPlaying) {
      return {
        borderTop: '5px solid #00FFFF',
        borderRight: '5px solid #00FFFF',
        borderBottom: '5px solid #00FFFF',
        borderLeft: '5px solid #00FFFF',
      }
    }
    
    if (isHighlighted(type)) {
      // Solid red border - show on all sides
      // Use negative margins in the style to overlap borders between adjacent items
      return {
        borderTop: '4px solid #FF0000',
        borderBottom: '4px solid #FF0000',
        borderLeft: '4px solid #FF0000',
        borderRight: '4px solid #FF0000',
      }
    }
    
    return {
      borderTop: '1px solid rgba(0, 0, 0, 0.2)',
      borderRight: '1px solid rgba(0, 0, 0, 0.2)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
      borderLeft: '1px solid rgba(0, 0, 0, 0.2)',
    }
  }

  const phonemeBoxStyle = (
    type: Phoneme['type'],
    isPlaying: boolean,
    borderStyles: { borderTop?: string; borderRight?: string; borderBottom?: string; borderLeft?: string },
    isHighlighted: boolean,
    isLeftHighlighted: boolean,
    isRightHighlighted: boolean
  ): CSSProperties => ({
    backgroundColor: getPhonemeColor(type),
    ...borderStyles,
    borderRadius: '0',
    padding: '8px 6px',
    flex: '1 1 auto',
    minWidth: '80px',
    maxWidth: '110px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: isPlaying 
      ? '0 0 12px rgba(0, 255, 255, 0.8), 0 0 24px rgba(0, 255, 255, 0.6), 0 0 36px rgba(0, 255, 255, 0.4)' 
      : isHighlighted
        ? '0 0 8px rgba(255, 0, 0, 0.6), 0 0 16px rgba(255, 0, 0, 0.4), 0 0 24px rgba(255, 0, 0, 0.3)'
        : 'none',
    position: 'relative',
    zIndex: isHighlighted ? 10 : 1,
    // Negative margins to make borders overlap and prevent double borders
    marginLeft: (isHighlighted && isLeftHighlighted) ? '-4px' : '0',
    marginRight: (isHighlighted && isRightHighlighted) ? '-4px' : '0',
  })

  const symbolStyle: CSSProperties = {
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '4px',
    textAlign: 'center',
    color: '#1E3A8A',
    lineHeight: '1.1',
  }

  const exampleStyle: CSSProperties = {
    fontSize: '9px',
    color: '#1E3A8A',
    textAlign: 'center',
    lineHeight: '1.2',
  }

  const primaryExampleStyle: CSSProperties = {
    ...exampleStyle,
    fontWeight: 600,
    textDecoration: 'underline',
    marginBottom: '1px',
    fontSize: '10px',
  }

  const renderPhonemeBox = (phoneme: Phoneme, index: number, allPhonemes: Phoneme[]) => {
    const isPlaying = playingSymbol === phoneme.symbol
    const highlighted = isHighlighted(phoneme.type)
    const isLeftEdge = index === 0
    const isRightEdge = index === allPhonemes.length - 1
    const leftPhoneme = index > 0 ? allPhonemes[index - 1] : null
    const rightPhoneme = index < allPhonemes.length - 1 ? allPhonemes[index + 1] : null
    const isLeftHighlighted = leftPhoneme ? isHighlighted(leftPhoneme.type) : false
    const isRightHighlighted = rightPhoneme ? isHighlighted(rightPhoneme.type) : false
    
    const borderStyles = getBorderStyles(
      phoneme.type,
      isPlaying,
      isLeftEdge,
      isRightEdge,
      isLeftHighlighted,
      isRightHighlighted
    )
    
    return (
      <div
        key={`${phoneme.symbol}-${index}`}
        data-phoneme-box="true"
        style={phonemeBoxStyle(phoneme.type, isPlaying, borderStyles, highlighted, isLeftHighlighted, isRightHighlighted)}
        onClick={(e) => {
          e.stopPropagation()
          playAudio(phoneme.symbol)
        }}
        onMouseEnter={(e) => {
          if (!isPlaying) {
            e.currentTarget.style.backgroundColor = getPhonemeColor(phoneme.type)
            e.currentTarget.style.opacity = '0.9'
          }
        }}
        onMouseLeave={(e) => {
          if (!isPlaying) {
            e.currentTarget.style.backgroundColor = getPhonemeColor(phoneme.type)
            e.currentTarget.style.opacity = '1'
          }
        }}
      >
        <div style={symbolStyle}>{phoneme.symbol}</div>
        <div style={primaryExampleStyle}>{phoneme.examples[0]}</div>
        <div style={exampleStyle}>
          {phoneme.examples.slice(1).join(', ')}
        </div>
      </div>
    )
  }

  const vowelRows = [
    vowels.slice(0, 6),
    vowels.slice(6, 13),
    vowels.slice(13),
  ]

  const consonantRows = [
    consonants.slice(0, 8),
    consonants.slice(8, 16),
    consonants.slice(16),
  ]

  const sectionStyle: CSSProperties = {
    marginBottom: '20px',
  }

  const sectionContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  }

  const sectionLabelStyle: CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: 'white',
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    padding: '0 6px',
    minWidth: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const chartContentStyle: CSSProperties = {
    flex: 1,
  }

  const rowStyle: CSSProperties = {
    display: 'flex',
    gap: '0',
    marginBottom: '0',
    flexWrap: 'nowrap',
    maxWidth: '100%',
    overflowX: 'auto',
  }

  const legendStyle: CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '8px',
    padding: '20px 24px',
    minWidth: '220px',
    maxWidth: '280px',
    flexShrink: 0,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  }

  const legendTitleStyle: CSSProperties = {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '16px',
    color: '#1E3A8A',
    textAlign: 'center',
  }

  const legendListStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  }

  const legendItemStyle = (isSelected: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '6px',
    backgroundColor: isSelected ? 'rgba(255, 0, 0, 0.15)' : 'transparent',
    border: isSelected ? '2px solid rgba(255, 0, 0, 0.5)' : '2px solid transparent',
    transition: 'all 0.2s ease',
  })

  const legendColorBoxStyle = (color: string): CSSProperties => ({
    width: '36px',
    height: '24px',
    backgroundColor: color,
    borderRadius: '4px',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    flexShrink: 0,
  })

  const legendTextStyle: CSSProperties = {
    fontSize: '14px',
    color: '#1E3A8A',
    fontWeight: 500,
  }

  const mainContentStyle: CSSProperties = {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    maxWidth: '100%',
  }

  const chartSectionStyle: CSSProperties = {
    flex: 1,
  }

  return (
    <div
      onClick={(e) => {
        const target = e.target as HTMLElement
        const isLegendClick = target.closest('[data-legend-item]')
        const isPhonemeBoxClick = target.closest('[data-phoneme-box]')
        
        if (!isLegendClick && !isPhonemeBoxClick) {
          setHighlightedCategory(null)
        }
      }}
    >
      <div style={mainContentStyle}>
        <div style={chartSectionStyle}>
          {/* Vowels Section */}
          <div style={sectionStyle}>
            <div style={sectionContainerStyle}>
              <div style={sectionLabelStyle}>Vowels</div>
              <div style={chartContentStyle}>
                {vowelRows.map((row, rowIndex) => (
                  <div key={`vowel-row-${rowIndex}`} style={rowStyle}>
                    {row.map((phoneme, index) => renderPhonemeBox(phoneme, index, row))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Consonants Section */}
          <div style={sectionStyle}>
            <div style={sectionContainerStyle}>
              <div style={sectionLabelStyle}>Consonants</div>
              <div style={chartContentStyle}>
                {consonantRows.map((row, rowIndex) => (
                  <div key={`consonant-row-${rowIndex}`} style={rowStyle}>
                    {row.map((phoneme, index) => {
                      const pairedConsonants = [
                        ['p', 'b'], ['t', 'd'], ['tʃ', 'dʒ'], ['k', 'g'],
                        ['f', 'v'], ['θ', 'ð'], ['s', 'z'], ['ʃ', 'ʒ']
                      ]
                      const needsSeparator = pairedConsonants.some(pair => 
                        pair[1] === phoneme.symbol && index > 0 && row[index - 1]?.symbol === pair[0]
                      )
                      
                      return (
                        <React.Fragment key={`${phoneme.symbol}-${index}`}>
                          {needsSeparator && (
                            <div style={{
                              width: '1px',
                              backgroundColor: 'rgba(128, 128, 128, 0.3)',
                              margin: '0',
                              height: '100%',
                            }} />
                          )}
                          {renderPhonemeBox(phoneme, index, row)}
                        </React.Fragment>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend - Right Side */}
        <div style={legendStyle}>
          <h3 style={legendTitleStyle}>Phonemic Chart</h3>
          <div style={legendListStyle}>
            <div
              data-legend-item="true"
              style={legendItemStyle(highlightedCategory === 'short-vowel')}
              onClick={(e) => {
                e.stopPropagation()
                setHighlightedCategory(highlightedCategory === 'short-vowel' ? null : 'short-vowel')
              }}
              onMouseEnter={(e) => {
                if (highlightedCategory !== 'short-vowel') {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (highlightedCategory !== 'short-vowel') {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <div style={legendColorBoxStyle('#F5E6D3')} />
              <span style={legendTextStyle}>short</span>
            </div>
            <div
              data-legend-item="true"
              style={legendItemStyle(highlightedCategory === 'long-vowel')}
              onClick={(e) => {
                e.stopPropagation()
                setHighlightedCategory(highlightedCategory === 'long-vowel' ? null : 'long-vowel')
              }}
              onMouseEnter={(e) => {
                if (highlightedCategory !== 'long-vowel') {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (highlightedCategory !== 'long-vowel') {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <div style={legendColorBoxStyle('#FFE4B5')} />
              <span style={legendTextStyle}>long</span>
            </div>
            <div
              data-legend-item="true"
              style={legendItemStyle(highlightedCategory === 'diphthong')}
              onClick={(e) => {
                e.stopPropagation()
                setHighlightedCategory(highlightedCategory === 'diphthong' ? null : 'diphthong')
              }}
              onMouseEnter={(e) => {
                if (highlightedCategory !== 'diphthong') {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (highlightedCategory !== 'diphthong') {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <div style={legendColorBoxStyle('#FFA500')} />
              <span style={legendTextStyle}>diphthongs</span>
            </div>
            <div
              data-legend-item="true"
              style={legendItemStyle(highlightedCategory === 'voiced-consonant')}
              onClick={(e) => {
                e.stopPropagation()
                setHighlightedCategory(highlightedCategory === 'voiced-consonant' ? null : 'voiced-consonant')
              }}
              onMouseEnter={(e) => {
                if (highlightedCategory !== 'voiced-consonant') {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (highlightedCategory !== 'voiced-consonant') {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <div style={legendColorBoxStyle('#ADD8E6')} />
              <span style={legendTextStyle}>voiced</span>
            </div>
            <div
              data-legend-item="true"
              style={legendItemStyle(highlightedCategory === 'unvoiced-consonant')}
              onClick={(e) => {
                e.stopPropagation()
                setHighlightedCategory(highlightedCategory === 'unvoiced-consonant' ? null : 'unvoiced-consonant')
              }}
              onMouseEnter={(e) => {
                if (highlightedCategory !== 'unvoiced-consonant') {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (highlightedCategory !== 'unvoiced-consonant') {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <div style={legendColorBoxStyle('#90EE90')} />
              <span style={legendTextStyle}>unvoiced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


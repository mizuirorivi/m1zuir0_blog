/**
 * BloomFilter implementation for user behavior tracking
 * Uses multiple hash functions to efficiently track user actions
 */
export class BloomFilter {
  private bitArray: Uint8Array
  private size: number
  private hashFunctions: number

  constructor(expectedItems: number = 10000, falsePositiveRate: number = 0.01) {
    // Calculate optimal size and hash functions
    this.size = Math.ceil((-expectedItems * Math.log(falsePositiveRate)) / Math.log(2) ** 2)
    this.hashFunctions = Math.ceil((this.size / expectedItems) * Math.log(2))
    this.bitArray = new Uint8Array(Math.ceil(this.size / 8))
  }

  /**
   * Hash function using djb2 algorithm
   */
  private hash1(str: string): number {
    let hash = 5381
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) + hash + str.charCodeAt(i)
    }
    return Math.abs(hash) % this.size
  }

  /**
   * Hash function using sdbm algorithm
   */
  private hash2(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash
    }
    return Math.abs(hash) % this.size
  }

  /**
   * Hash function using FNV-1a algorithm
   */
  private hash3(str: string): number {
    let hash = 2166136261
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i)
      hash *= 16777619
    }
    return Math.abs(hash) % this.size
  }

  /**
   * Get multiple hash values for a string
   */
  private getHashes(str: string): number[] {
    const hashes = [this.hash1(str), this.hash2(str), this.hash3(str)]

    // Generate additional hashes if needed
    for (let i = 3; i < this.hashFunctions; i++) {
      hashes.push((hashes[0] + i * hashes[1]) % this.size)
    }

    return hashes.slice(0, this.hashFunctions)
  }

  /**
   * Set a bit in the bit array
   */
  private setBit(index: number): void {
    const byteIndex = Math.floor(index / 8)
    const bitIndex = index % 8
    this.bitArray[byteIndex] |= 1 << bitIndex
  }

  /**
   * Check if a bit is set in the bit array
   */
  private getBit(index: number): boolean {
    const byteIndex = Math.floor(index / 8)
    const bitIndex = index % 8
    return (this.bitArray[byteIndex] & (1 << bitIndex)) !== 0
  }

  /**
   * Add an item to the bloom filter
   */
  add(item: string): void {
    const hashes = this.getHashes(item)
    for (const hash of hashes) {
      this.setBit(hash)
    }
  }

  /**
   * Check if an item might be in the bloom filter
   * Returns true if item might be present (with false positive rate)
   * Returns false if item is definitely not present
   */
  mightContain(item: string): boolean {
    const hashes = this.getHashes(item)
    for (const hash of hashes) {
      if (!this.getBit(hash)) {
        return false
      }
    }
    return true
  }

  /**
   * Get the current false positive probability
   */
  getCurrentFalsePositiveRate(): number {
    const setBits = this.countSetBits()
    return Math.pow(setBits / this.size, this.hashFunctions)
  }

  /**
   * Count the number of set bits
   */
  private countSetBits(): number {
    let count = 0
    for (let i = 0; i < this.bitArray.length; i++) {
      let byte = this.bitArray[i]
      while (byte) {
        count += byte & 1
        byte >>= 1
      }
    }
    return count
  }

  /**
   * Export the filter state for persistence
   */
  export(): {
    bitArray: number[]
    size: number
    hashFunctions: number
  } {
    return {
      bitArray: Array.from(this.bitArray),
      size: this.size,
      hashFunctions: this.hashFunctions,
    }
  }

  /**
   * Import a filter state
   */
  import(data: { bitArray: number[]; size: number; hashFunctions: number }): void {
    this.bitArray = new Uint8Array(data.bitArray)
    this.size = data.size
    this.hashFunctions = data.hashFunctions
  }

  /**
   * Clear the bloom filter
   */
  clear(): void {
    this.bitArray.fill(0)
  }

  /**
   * Get filter statistics
   */
  getStats(): {
    size: number
    hashFunctions: number
    setBits: number
    fillRatio: number
    estimatedFalsePositiveRate: number
  } {
    const setBits = this.countSetBits()
    return {
      size: this.size,
      hashFunctions: this.hashFunctions,
      setBits,
      fillRatio: setBits / this.size,
      estimatedFalsePositiveRate: this.getCurrentFalsePositiveRate(),
    }
  }
}

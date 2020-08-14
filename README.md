# mutexcache-node

A small utility library for dynamically creating mutexes based on cache keys. 

## Use case

Say you're implementing a graphql server, with object fields which asynchronously resolve independently of each other. 
Multiple fields perform the same operation, and thus should use a mutex and some basic caching to ensure that the 
database query happens at most once. If you have an array of these objects, suddenly they're all using the same mutex,
which can degrade performance. 

Instead of using one mutex to rule them all, dynamically create multiple short-lived mutexes which each object can use 
independently of other resolving objects. By using the same cache key for the mutexes as you would for your cache check,
you can almost transparently use dynamically created mutexes without worrying about performance or allocation/deallocation
of mutexes. 

With mutexcache, if a mutex associated with a cache key is already stored, then it will be returned. Otherwise, a new 
mutex will silently be created, stored for future use, and returned. 

## Installation

**NPM**: `npm i @jalavosus/mutexcache`

**Yarn**: `yarn add @jalavosus/mutexcache`

## Usage

```javascript
import MutexCache from "@jalavosus/mutexcache"

let mutexCache = new MutexCache(30*1000) // use whatever ttl you'd like, or not -- MutexCache defaults to 30 seconds.
let cacheKeyA = "key_a"
let cacheKeyB = "key_b"

let mutA = mutexCache.get(cacheKeyA)
// pass the optional ttl parameter to specify a ttl other than the default 
// for that specific mutex
let mutB = mutexCache.get(cacheKeyB, 45*1000)

// [...do stuff with your mutex...]
```
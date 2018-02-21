const DEQUE_MAX_CAPACITY =  (1 << 30) | 0;
const DEQUE_MIN_CAPACITY = 16;

export class Deque {
  constructor(capacity) {
      this._capacity = getCapacity(capacity);
      this._length = 0;
      this._front = 0;
      if (isArray(capacity)) {
          const len = capacity.length;
          for (let i = 0; i < len; ++i) {
              this[i] = capacity[i];
          }
          this._length = len;
      }
  }

  toArray() {
      const len = this._length;
      const ret = new Array(len);
      const front = this._front;
      const capacity = this._capacity;
      for (let j = 0; j < len; ++j) {
          ret[j] = this[(front + j) & (capacity - 1)];
      }
      return ret;
  }

  push(item) {
      const argsLength = arguments.length;
      let length = this._length;
      if (argsLength > 1) {
          const capacity = this._capacity;
          if (length + argsLength > capacity) {
              for (var i = 0; i < argsLength; ++i) {
                  this._checkCapacity(length + 1);
                  var j = (this._front + length) & (this._capacity - 1);
                  this[j] = arguments[i];
                  length++;
                  this._length = length;
              }
              return length;
          }
          else {
              var j = this._front;
              for (var i = 0; i < argsLength; ++i) {
                  this[(j + length) & (capacity - 1)] = arguments[i];
                  j++;
              }
              this._length = length + argsLength;
              return length + argsLength;
          }

      }

      if (argsLength === 0) return length;

      this._checkCapacity(length + 1);
      var i = (this._front + length) & (this._capacity - 1);
      this[i] = item;
      this._length = length + 1;
      return length + 1;
  }

  pop() {
      const length = this._length;
      if (length === 0) {
          return void 0;
      }
      const i = (this._front + length - 1) & (this._capacity - 1);
      const ret = this[i];
      this[i] = void 0;
      this._length = length - 1;
      return ret;
  }

  shift() {
      const length = this._length;
      if (length === 0) {
          return void 0;
      }
      const front = this._front;
      const ret = this[front];
      this[front] = void 0;
      this._front = (front + 1) & (this._capacity - 1);
      this._length = length - 1;
      return ret;
  }

  unshift(item) {
      let length = this._length;
      const argsLength = arguments.length;


      if (argsLength > 1) {
          var capacity = this._capacity;
          if (length + argsLength > capacity) {
              for (var i = argsLength - 1; i >= 0; i--) {
                  this._checkCapacity(length + 1);
                  var capacity = this._capacity;
                  var j = (((( this._front - 1 ) &
                      ( capacity - 1) ) ^ capacity ) - capacity );
                  this[j] = arguments[i];
                  length++;
                  this._length = length;
                  this._front = j;
              }
              return length;
          }
          else {
              let front = this._front;
              for (var i = argsLength - 1; i >= 0; i--) {
                  var j = (((( front - 1 ) &
                      ( capacity - 1) ) ^ capacity ) - capacity );
                  this[j] = arguments[i];
                  front = j;
              }
              this._front = front;
              this._length = length + argsLength;
              return length + argsLength;
          }
      }

      if (argsLength === 0) return length;

      this._checkCapacity(length + 1);
      var capacity = this._capacity;
      var i = (((( this._front - 1 ) &
          ( capacity - 1) ) ^ capacity ) - capacity );
      this[i] = item;
      this._length = length + 1;
      this._front = i;
      return length + 1;
  }

  peekBack() {
      const length = this._length;
      if (length === 0) {
          return void 0;
      }
      const index = (this._front + length - 1) & (this._capacity - 1);
      return this[index];
  }

  peekFront() {
      if (this._length === 0) {
          return void 0;
      }
      return this[this._front];
  }

  get(index) {
      let i = index;
      if ((i !== (i | 0))) {
          return void 0;
      }
      const len = this._length;
      if (i < 0) {
          i = i + len;
      }
      if (i < 0 || i >= len) {
          return void 0;
      }
      return this[(this._front + i) & (this._capacity - 1)];
  }

  isEmpty() {
      return this._length === 0;
  }

  clear() {
      const len = this._length;
      const front = this._front;
      const capacity = this._capacity;
      for (let j = 0; j < len; ++j) {
          this[(front + j) & (capacity - 1)] = void 0;
      }
      this._length = 0;
      this._front = 0;
  }

  toString() {
      return this.toArray().toString();
  }

  get length() {
      return this._length;
  }

  // set length() {
  //     throw new RangeError("");
  // }

  _checkCapacity(size) {
      if (this._capacity < size) {
          this._resizeTo(getCapacity(this._capacity * 1.5 + 16));
      }
  }

  _resizeTo(capacity) {
      const oldCapacity = this._capacity;
      this._capacity = capacity;
      const front = this._front;
      const length = this._length;
      if (front + length > oldCapacity) {
          const moveItemsCount = (front + length) & (oldCapacity - 1);
          arrayMove(this, 0, this, oldCapacity, moveItemsCount);
      }
  }
}

Deque.prototype.valueOf = Deque.prototype.toString;
Deque.prototype.removeFront = Deque.prototype.shift;
Deque.prototype.removeBack = Deque.prototype.pop;
Deque.prototype.insertFront = Deque.prototype.unshift;
Deque.prototype.insertBack = Deque.prototype.push;
Deque.prototype.enqueue = Deque.prototype.push;
Deque.prototype.dequeue = Deque.prototype.shift;
Deque.prototype.toJSON = Deque.prototype.toArray;


var isArray = Array.isArray;

function arrayMove(src, srcIndex, dst, dstIndex, len) {
  for (let j = 0; j < len; ++j) {
      dst[j + dstIndex] = src[j + srcIndex];
      src[j + srcIndex] = void 0;
  }
}

function pow2AtLeast(n) {
  n = n >>> 0;
  n = n - 1;
  n = n | (n >> 1);
  n = n | (n >> 2);
  n = n | (n >> 4);
  n = n | (n >> 8);
  n = n | (n >> 16);
  return n + 1;
}

function getCapacity(capacity) {
  if (typeof capacity !== "number") {
      if (isArray(capacity)) {
          capacity = capacity.length;
      }
      else {
          return DEQUE_MIN_CAPACITY;
      }
  }
  return pow2AtLeast(
      Math.min(
          Math.max(DEQUE_MIN_CAPACITY, capacity), DEQUE_MAX_CAPACITY)
  );
}

export default Deque;
// 整数转罗马数字
var intToRoman = function (num) {
  let nums=[1000,900,500,400,100,90,50,40,10,9,5,4,1],
  chars=['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let result='';
  while(num){
    if(num>=nums[0]){
      result+=chars[0];
      num-=nums[0];
    }else{
      nums.shift();
      chars.shift();
    }
  }
  return result;

};

// 搜索旋转排序数组
var search = function(nums, target) {
  if (!nums.length) return -1
  
  let i = 0, j = nums.length - 1
  if(target < nums[i] && target > nums[j]) return -1
  while (i <= j) {
    if (target === nums[i]) return i
    if (target === nums[j]) return j
   
    i++
    j--
    
  }

  return -1

};
// 在排序数组中查找元素的第一个和最后一个位置
var searchRange = function(nums, target) {
  if (!nums.length) return [-1, -1]
  let index = nums.findIndex(i => i===target)

  if(index < 0) return [-1, -1]
  let last = index + 1
  while (nums[last] === target) {
    last ++
  }

  return [index, last]
};

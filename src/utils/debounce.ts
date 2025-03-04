/**
 * 防抖函数
 * @param func - 要防抖的函数
 * @param wait - 防抖延迟时间（毫秒）
 * @param immediate - 是否在等待时间开始时立即调用函数
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number,
    immediate: boolean = false
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
  
    return function(this: any, ...args: Parameters<T>) {
      const context = this;
  
      if (timeout) {
        clearTimeout(timeout);
      }
  
      if (immediate && !timeout) {
        func.apply(context, args);
      }
  
      timeout = setTimeout(() => {
        if (!immediate) {
          func.apply(context, args);
        }
      }, wait);
    };
  }

//格式化数据
export function getFormatNumber(num:number, decimalPlaces:number) {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimalPlaces,
    });
    return formatter.format(num);
  }
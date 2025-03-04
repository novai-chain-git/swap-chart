export const formatDate = date => {
  const dateTime = new Date(date * 1000)
  const lang = localStorage.getItem('i18nextLng') || 'en'

  // 自定义格式化选项
  const options = {
    year: 'numeric',
    month: 'short', // 使用简写月份名称（如 Sep）
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true // 12小时制，显示 AM/PM
  }
  // 转换为指定格式的日期字符串

  const time = new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', options).format(dateTime)
  return time
}

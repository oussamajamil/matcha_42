export const colorsLog = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
  };
  
  // Define icons
  export const iconsLog = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };
  
  // Function to format and log messages
  export default function logMessage(message:string, color:string, icon:string) {
    const formattedMessage = `${color}${icon} ${message}${colorsLog.reset}`;
    console.log(formattedMessage);
  }
  
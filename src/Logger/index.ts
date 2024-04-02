import winston from 'winston';
const { combine, printf } = winston.format;

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
  };
 
  
  
  // Define custom colors for different log levels
  const colors = {
      error: 'red',
      warn: 'yellow',
      info: 'green',
      http: 'magenta',
      debug: 'white',
  };


  


winston.addColors(colors);//ignore this if we use customColors

//combine multiple formatting options
const format = combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    // Add colorizing formatter
    winston.format.colorize({ all: true }),
    //Define the log message format
    printf((info) => {
      //return to log console, timestap,log level and log timestamp
        return `${info.timestamp} [${info.level}]: ${info.message}`;
    })
)

const transports = [
  // Log to the console(transport log to console)
  new winston.transports.Console(),

  // Log to a file(transport log to logfile.log)
  //new winston.transports.File({ filename: 'logfile.log' })
] 


  // Define your Winston logger configuration
  const logger = winston.createLogger({

      level: 'debug', // Set the log level(this record message from this level to higher up)

      // levels: customColors, //using customColors
      format,
      transports
    });

    export default logger
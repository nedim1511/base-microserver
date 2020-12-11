import { createLogger, format, transports } from 'winston';
import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';

const { combine, timestamp, prettyPrint, colorize } = format;

const errorStackFormat = winston.format(info => {
    if (info instanceof Error) {
        return Object.assign({}, info, {
            stack: info.stack,
            message: info.message
        })
    }
    return info
})

const logger = createLogger({
    format: combine(
        errorStackFormat(),
        timestamp(),
        prettyPrint(),
    ),
    transports: [
        new transports.Console(),
    ],
    exitOnError: false,
});

if (process.env.NODE_ENV === 'production') {
    const cloudwatchConfig = {
        logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
        logStreamName: `${process.env.CLOUDWATCH_GROUP_NAME}-${process.env.ENV_NAME}`,
        createLogStream: true,
        awsAccessKeyId: process.env.CLOUDWATCH_ACCESS_KEY,
        awsSecretKey: process.env.CLOUDWATCH_SECRET_ACCESS_KEY,
        awsRegion: process.env.CLOUDWATCH_REGION,
        messageFormatter: (item) => `[${item.level}] : ${item.message} \n${item.stack ? item.stack : ''}`
    }
    logger.add(new WinstonCloudWatch(cloudwatchConfig))
}

export default logger;
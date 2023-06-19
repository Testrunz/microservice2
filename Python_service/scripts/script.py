import sys
import json

if __name__ == '__main__':
    topic = sys.argv[1]
    message =  json.loads(sys.argv[2])
    
    # Do something with the variables
    print(f'Topic: {topic}, Message: {list(message.values())}')
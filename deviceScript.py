import serial
from time import sleep
import time
import sys
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import pyrebase

def convert_to_degrees(raw_value):

    if raw_value == '':
        return 0

    raw_value = float(raw_value)
    decimal_value = raw_value/100.00
    degrees = int(decimal_value)
    mm_mmmm = (decimal_value - int(decimal_value))/0.6
    position = degrees + mm_mmmm
    position = "%.4f" %(position)
    return position

#FireBase DataBase Config


config = {
  "apiKey": "9IZ2KSvRRIK8GN1mJGrPMZwYeHt7PoKLS5V5cwVX",
  "authDomain": "basicstesing.firebaseapp.com",
  "databaseURL": "https://basicstesing-default-rtdb.asia-southeast1.firebasedatabase.app/",
  "storageBucket": "basicstesing.appspot.com"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()

#Gps Serial Data Config
ser = serial.Serial ("/dev/ttyAMA0")
GPGGA_buffer = 0
NMEA_buff = 0

data = {
        "Latitude": 0,
        "Longitude": 0,
}

#RFID Card Config
reader = SimpleMFRC522()

#RFID Card Config
reader = SimpleMFRC522()

#PIR Sensor Config
PIR_input = 16                          #read PIR Output
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)                #choose pin no. system
GPIO.setup(PIR_input, GPIO.IN)

try:
    while True:

        #GPS Portion
        print("Loop Running")

        received_data = (str)(ser.readline()) #read NMEA string received
        GPGGA_data_available = received_data.find("$GPGGA,")   #check for NMEA GPGGA string     
        #print(received_data,type(received_data))

        if (GPGGA_data_available>0):
            GPGGA_buffer = received_data.split("$GPGGA,",1)[1]  #store data coming after "$GPGGA," string
            NMEA_buff = (GPGGA_buffer.split(','))
            #print(NMEA_buff,type(NMEA_buff))
            lat = convert_to_degrees(NMEA_buff[1])
            lon = convert_to_degrees(NMEA_buff[3])

            print('Latitude : ',lat,' Longitude : ',lon)
	    if((lat!=0 and lon!=0) and (data["Latitude"]!=lat and data["Longitude"]!=lon)):
                data["Latitude"] =lat
                data["Longitude"] = lon
                db.child("Location").set(data)


        #RFID Card Portion

        id, text = reader.read_no_block()
        print(id,text)
        if(id!=None and text!=None):
            print('Data Read From Card : ',text)
            cardData={"Name":text}
            db.child("Passanger RFID").push(cardData)
        else:
            print("Card Not Found")

        #PIR Sensor Data

        passangerDetected = GPIO.input(PIR_input)

        if(passangerDetected):
            print("PIR Input : Object Detected")
            db.child("Passanger Count").set({'Count':passangerDetected})
        else:
            print("PIR Input : Object Not Detected")
            
except KeyboardInterrupt:
    GPIO.cleanup()
    sys.exit(0)



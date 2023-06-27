#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

/*WIFI AP Set*/
const char* ssid = "";
const char* password = "";

/*伺服器路徑*/
String serverSource = "http://[Server_IP]:3095";
String serverName = serverSource + "/upload/Sensor01/data?";

/*timer*/
unsigned long lastTime = 0;
unsigned long timerDelay = 10000; //10sec

/*WiFi連結*/
void cnWiFi(){
   WiFi.begin(ssid, password);
   Serial.println("Connecting");
   while(WiFi.status() != WL_CONNECTED) {
     delay(500);
     Serial.print(".");
   }
   Serial.println("");
   Serial.print("Connected to WiFi network with IP Address: ");
   Serial.println(WiFi.localIP());
   
}
void httpPost(){
   WiFiClient client;
   HTTPClient http;
  
   /*數值上傳*/
   String humUD = "hum="+String(30);
   String tempUD = "temp="+String(44.5);
   String coUD = "co="+String(77.2);
   String co2UD = "co2="+String(55);
   String tvocUD = "tvoc="+String(40.11);
   String pm25UD = "pm25="+String(10);
   String query = humUD+"&"+tempUD+"&"+coUD+"&"+co2UD+"&"+tvocUD+"&"+pm25UD;  
   String cnServer = serverName + query;

   // Your Domain name with URL path or IP address with path
   http.begin(client, cnServer);

   // Specify content-type header
   http.addHeader("Content-Type", "application/x-www-form-urlencoded"); 
  
   Serial.print("Server= ");
   Serial.println(cnServer);

  /*HTTP Status*/   
  int httpResponseCode = http.POST("");
  if (httpResponseCode>0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String payload = http.getString();
    Serial.println(payload);
  }else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
     
  // Free resources
    http.end();
}

/*主程式*/
void setup() {
  Serial.begin(9600);
  cnWiFi();
}

void loop() {  
  
  // Send an HTTP POST request depending on timerDelay
  if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      httpPost();
    }else{
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}
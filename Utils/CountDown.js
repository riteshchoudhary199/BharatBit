import moment from "moment";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Colors } from "../Constants";
import { TextStyles } from "../Styles/ComnStyle";
import { textScale } from "../Styles/responsiveSize";


const useCountdown = (targetDate) => {
    const countDownDate = new Date(targetDate).getTime();
  
    const [countDown, setCountDown] = useState(
      countDownDate - new Date().getTime()
    );
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCountDown(countDownDate - new Date().getTime());
        // console.log('targetDate is : ---- ',targetDate)
        // console.log('new Date(targetDate).getTime(); : ---', new Date().getTime())
        if (countDown < 0){
          clearInterval(interval)
        }
      }, 1000);
  
      return () => clearInterval(interval);
    }, [countDownDate]);
  
    return getReturnValues(countDown);
  };
  
  const getReturnValues = (countDown) => {
    // calculate time left
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
  
    return [days, hours, minutes, seconds];
  };
  const CountdownTimer = ({ targetDate ,countDownTimer =()=>{}}) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate);
    countDownTimer([days, hours, minutes, seconds])
    if (days + hours + minutes + seconds == 0) {
      return (
        <Text style={{...TextStyles.medium,fontSize:textScale(12) ,color: Colors.text_red_dark}}> Expired </Text>
      );
    } else {
      return (
        <ShowCounter
          days={days}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
        />
      );
    }
  };

  const ShowCounter = ({ days, hours, minutes, seconds }) => {
    return (
      <View style={{flexDirection:'row',gap:2}}>
          {/* <DateTimeDisplay value={(days)?hours:''} type={'D'} isDanger={days <= 3} /> */}
          {/* <DateTimeDisplay value={(hours)?hours:''} type={'H'} isDanger={false} /> */}
          <DateTimeDisplay value={(minutes)?minutes:'' } type={(minutes > 0 && seconds > 0 )?':':''} isDanger={false} />
          <DateTimeDisplay value={(seconds)?seconds:''} type={(minutes > 0)?'mins':(seconds > 0)?'secs':''} isDanger={false} />
      </View>
    );
  };

  const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <View className={isDanger ? 'countdown danger' : 'countdown'}>
      <Text style={{...TextStyles.medium,fontSize:textScale(12)}}>{`${value ?? ''} ${type}` }</Text>
    </View>
  );
};

  export { useCountdown ,CountdownTimer,DateTimeDisplay,ShowCounter};
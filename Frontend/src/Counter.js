import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <View style={{ alignItems: 'center', marginTop: 50 }}>
      <Text style={{ fontSize: 24 }}>Counter : {count}</Text>

      <View style={{ flexDirection: 'row', marginTop: 50 ,justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Button title="Increase" onPress={() => setCount(count + 1)} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Button title="Decrease" onPress={() => setCount(count - 1)} />
        </View>
      </View>

      <View style={{ flexDirection: 'row',marginTop: 20 , justifyContent: 'space-between', paddingHorizontal: 20 }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Button title="multiply" onPress={() => setCount(count * count)} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Button title="Divide" onPress={() => setCount(count / count)} />
              </View>
            </View>


    </View>
  );
};

export default Counter;
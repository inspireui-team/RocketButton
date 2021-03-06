import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    padding: 20
  },
  line: {
    position: "absolute",
    borderRadius: 10
  }
});

const hitSlop = { top: 20, bottom: 20, left: 20, right: 20 };

export default class CrossMarker extends Component {
  componentWillMount() {
    this.animatedValue = new Animated.Value(0);
    this.cross = false;
  }

  startAnimation(target) {
    Animated.timing(this.animatedValue, {
      toValue: target,
      duration: this.props.delay,
      easing: Easing.linear
    }).start();
  }

  toCross = () => {
    const { onMarkPress } = this.props;

    if (typeof onMarkPress === "function") onMarkPress();
    this.startAnimation(1);
  };

  toMark = () => {
    const { onCrossPress } = this.props;

    if (typeof onCrossPress === "function") onCrossPress();
    this.startAnimation(0);
  };

  changeMode = () => {
    this.cross ? this.toMark() : this.toCross();
    this.cross = !this.cross;
  };

  renderLine = (angle, offset) => {
    const { color, height, width } = this.props;

    return (
      <Animated.View
        style={[
          styles.line,
          {
            backgroundColor: color,
            height,
            width,
            transform: [{ rotateZ: angle }],
            left: offset
          }
        ]}
      />
    );
  };

  render() {
    const { height, width } = this.props,
      origin = {
        x: height,
        y: height / 2
      };

    const leftLinePos = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.x - height / 3, origin.x]
    });

    const rightLinePos = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.x + height / 3, origin.x]
    });

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.changeMode} hitSlop={hitSlop}>
          <View style={styles.button}>
            {this.renderLine("-45 deg", leftLinePos)}
            {this.renderLine("45 deg", rightLinePos)}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

CrossMarker.propTypes = {
  color: PropTypes.string,
  delay: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  onCrossPress: PropTypes.func,
  onMarkPress: PropTypes.func,
  onCrossTransformed: PropTypes.func,
  onMarkTransformed: PropTypes.func
};

CrossMarker.defaultProps = {
  color: "#000",
  delay: 500,
  height: 30,
  width: 4,
  onCrossPress: () => {},
  onMarkPress: () => {}
};

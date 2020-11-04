import React from 'react';
import { connect } from 'react-redux';
import { View, Dimensions } from 'react-native';

class Progress extends React.PureComponent {  
    state = {
        data:0
    }

    componentDidUpdate(prevProps) {
        if(this.props.progress.data === 0 || this.props.progress.show === false) {
            setTimeout(() => {
                this.setState({
                    data: this.props.progress.data
                })
            }, 400)
        } else {
            this.setState({
                data: this.props.progress.data
            })
        }
    }

    render() {
        const progressContainer = {
            backgroundColor:'transparent',
            height:2,
            width:Dimensions.get('window').width,
            position:'absolute',
            top:0,
            left:0,
            zIndex:99999
        };

        const progressFill = {
            width:Dimensions.get('window').width * this.state.data,
            maxWidth:Dimensions.get('window').width,
            backgroundColor:'rgba(26, 188, 156, 1)',
            height:2
        };

        const progressHide = {
            backgroundColor:'rgba(26, 188, 156, 0)',
        }

        return (
            <View style={progressContainer}>
                {this.props.progress.show ?
                    <View style={progressFill}></View>
                    : <View></View>
                }
            </View>
        )

    }
}

const mapStateToProps = state => {
    return {
        progress: state.reducer.user.progress
    };
};

export default connect( mapStateToProps, null )(Progress);
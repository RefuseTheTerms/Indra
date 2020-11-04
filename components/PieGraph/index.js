import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActionCreators from '../../actions/userActions';

import { View } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { Text } from "react-native-svg";

class PieGraph extends React.PureComponent {    

    renderPieGraph = (slices) => {
        const Labels = ({ slices, height, width }) => {
            return slices.map((slice, index) => {
                const { labelCentroid, pieCentroid, data } = slice;
                return (
                    <Text
                        key={data.key}
                        x={pieCentroid[ 0 ]}
                        y={pieCentroid[ 1 ]}
                        fill={'white'}
                        textAnchor={'middle'}
                        alignmentBaseline={'middle'}
                        fontSize={14}
                        strokeWidth={0.2}
                        color="#EEEEEE"
                    >
                        {data.name}
                    </Text>
                )
            })
        }

        return (
            <PieChart
                style={{ height: 300 }}
                valueAccessor={({ item }) => item.count}
                data={slices}
                spacing={0}
                outerRadius={'100%'}
            >
                <Labels />
            </PieChart>
        )
    }

    render() {
        this.props.slices.forEach((slice, i) => {
            slice.svg.onPress = () => this.props.userActions.handleFooterTab(5, slice.name);
        });

        return (
            <View>
                {this.renderPieGraph(this.props.slices)}
            </View>
        )

    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActionCreators, dispatch)
    };
};

export default connect( null, mapDispatchToProps )(PieGraph);
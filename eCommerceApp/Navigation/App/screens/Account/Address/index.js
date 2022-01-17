import React, { Component } from 'react'
import {
    FlatList,
} from 'react-native'
import { connect } from 'react-redux'
import CustomHeader from '../../../../../components/CustomHeader'
import SafeAreaView from '../../../../../components/SafeAreaView'
import { emptyTitle, headerLeft } from '../../../../../ultis/CommonUlti'
import PrimaryBlueButton from '../../../../../components/PrimaryBlueButton'
import AddressItem from '../../../../../components/AddressItem'
import { normalize, normalizeV } from '../../../../../ultis/Dimentions'
import * as actions from '../../../../../redux/actions'

class Address extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listAddress: []
        }
    }

    async componentDidMount() {
        const { userInfo } = this.props
        try {
            await this.props.getAllAddress(userInfo._id, this.props.accessToken)
        } catch (error) {
            await this.props.handleGetNewToken(this.props.refreshToken, this.props.userInfo._id)
            await this.props.getAllAddress(userInfo._id, this.props.accessToken)
        }

        const { address } = this.props
        if (address && address.length > 0) {
            this.setState({ listAddress: address })
        } else {
            this.state.listAddress.length !== 0 ? this.setState({ listAddress: [] }) : 0
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { address } = this.props
        if (prevProps.address.length !== address.length) {
            this.setState({ listAddress: address })
        }
    }

    handleEdit = (item) => {
        this.props.navigation.navigate("Add Or Edit Address", item._id)
    }

    handleDelete = (item) => {
        this.props.navigation.navigate("Delete Address", item._id)
    }

    getBorderColor = (item) => {
        const { selectedAddress } = this.state
        if (selectedAddress && selectedAddress._id === item._id)
            return "#40BFFF"
        return "#EBF0FF"

    }

    render() {
        const { listAddress } = this.state
        const { navigation, route } = this.props
        return (
            <SafeAreaView>
                <CustomHeader
                    headerLeft={() => headerLeft({ navigation: navigation, routeName: route.name })}
                />

                <FlatList
                    data={listAddress}
                    keyExtractor={obj => obj.city}
                    style={{ marginHorizontal: normalize(16), marginTop: normalizeV(16) }}
                    renderItem={({ item }) =>
                        <AddressItem
                            item={item}
                            borderColor={this.getBorderColor(item)}
                            handleEdit={this.handleEdit}
                            handleDelete={this.handleDelete}
                            handleChoose={() => { }}
                        />
                    }
                    ListEmptyComponent={emptyTitle(0, "You don't have any address. Create now")}
                />
                <PrimaryBlueButton
                    title="Add Address"
                    onPress={() => navigation.navigate("Add Or Edit Address", "ADD")}
                    marginBottom={normalizeV(16)}
                />
            </SafeAreaView>
        )
    }
}


const mapStateToProps = state => {
    return {
        userInfo: state.app.userInfo,
        address: state.user.address,
        accessToken: state.app.accessToken,
        refreshToken: state.app.refreshToken
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllAddress: (userId, token) => dispatch(actions.handleGetAllAddress(userId, token)),
        handleGetNewToken: (refreshToken, userId) => dispatch(actions.handleGenerateNewToken(refreshToken, userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Address)
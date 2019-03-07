import React, { Component } from 'react'
import { connect, MapStateToProps } from 'react-redux'

import RootState, { MapDispatchToProps, ClickHandler } from '../../types'
import Ribbon from './ribbon'
import * as actions from '../actions'
import * as selectors from '../selectors'

import {
    IndexDropdown,
    AddListDropdownContainer,
} from 'src/common-ui/containers'
import * as popup from 'src/popup/selectors'
import * as popupActs from 'src/popup/actions'
import { selectors as pause, acts as pauseActs } from 'src/popup/pause-button'
import { acts as tagActs, selectors as tags } from 'src/popup/tags-button'
import {
    selectors as collections,
    acts as collectionActs,
} from 'src/popup/collections-button'
import {
    acts as bookmarkActs,
    selectors as bookmark,
} from 'src/popup/bookmark-button'
import { PageList } from 'src/custom-lists/background/types'

interface StateProps {
    isExpanded: boolean
    isRibbonEnabled: boolean
    isTooltipEnabled: boolean
    isPaused: boolean
    isBookmarked: boolean
    searchValue: string
    url: string
    tags: string[]
    initTagSuggs: string[]
    collections: PageList[]
    initCollSuggs: PageList[]
}

interface DispatchProps {
    onInit: () => void
    handleRibbonToggle: () => void
    handleTooltipToggle: () => void
    handleMouseEnter: () => void
    handleMouseLeave: () => void
    handlePauseToggle: () => void
    handleBookmarkToggle: () => void
    handleSearchChange: ClickHandler<HTMLInputElement>
    onTagAdd: (tag: string) => void
    onTagDel: (tag: string) => void
    onCollectionAdd: (collection: PageList) => void
    onCollectionDel: (collection: PageList) => void
}

interface OwnProps {
    isSidebarOpen: boolean
    handleRemoveRibbon: () => void
    insertOrRemoveTooltip: (isTooltipEnabled: boolean) => void
    openSidebar: () => void
    closeSidebar: () => void
}

type Props = StateProps & DispatchProps & OwnProps

class RibbonContainer extends Component<Props> {
    private ribbonRef: HTMLElement

    componentDidMount() {
        this._setupHoverListeners()
        this.props.onInit()
    }

    componentWillUnmount() {
        this._removeHoverListeners()
    }

    private _setupHoverListeners() {
        this.ribbonRef.addEventListener(
            'mouseenter',
            this.props.handleMouseEnter,
        )
        this.ribbonRef.addEventListener(
            'mouseleave',
            this.props.handleMouseLeave,
        )
    }

    private _removeHoverListeners() {
        this.ribbonRef.removeEventListener(
            'mouseenter',
            this.props.handleMouseEnter,
        )
        this.ribbonRef.removeEventListener(
            'mouseleave',
            this.props.handleMouseLeave,
        )
    }

    private _setRibbonRef = (ref: HTMLElement) => {
        this.ribbonRef = ref
    }

    private _handleTooltipToggle = () => {
        this.props.insertOrRemoveTooltip(this.props.isTooltipEnabled)
        this.props.handleTooltipToggle()
    }

    private renderTagsManager() {
        return (
            <IndexDropdown
                url={this.props.url}
                initFilters={this.props.tags}
                source="tag"
                onFilterAdd={this.props.onTagAdd}
                onFilterDel={this.props.onTagDel}
                isForRibbon={true}
            />
        )
    }

    private renderCollectionsManager() {
        return (
            <AddListDropdownContainer
                env="inpage"
                url={this.props.url}
                initLists={this.props.collections}
                initSuggestions={this.props.initCollSuggs}
                onFilterAdd={this.props.onCollectionAdd}
                onFilterDel={this.props.onCollectionDel}
            />
        )
    }

    render() {
        const {
            isExpanded,
            isRibbonEnabled,
            isTooltipEnabled,
            openSidebar,
            handleRibbonToggle,
            handleRemoveRibbon,
            isSidebarOpen,
            isPaused,
            isBookmarked,
            searchValue,
            closeSidebar,
            handleSearchChange,
            handlePauseToggle,
            handleBookmarkToggle,
        } = this.props

        return (
            <div ref={this._setRibbonRef}>
                <Ribbon
                    isExpanded={isExpanded}
                    isRibbonEnabled={isRibbonEnabled}
                    isTooltipEnabled={isTooltipEnabled}
                    isSidebarOpen={isSidebarOpen}
                    isPaused={isPaused}
                    isBookmarked={isBookmarked}
                    searchValue={searchValue}
                    tagManager={this.renderTagsManager()}
                    collectionsManager={this.renderCollectionsManager()}
                    openSidebar={openSidebar}
                    closeSidebar={closeSidebar}
                    handleRibbonToggle={handleRibbonToggle}
                    handleTooltipToggle={this._handleTooltipToggle}
                    handleRemoveRibbon={handleRemoveRibbon}
                    handleSearchChange={handleSearchChange}
                    handlePauseToggle={handlePauseToggle}
                    handleBookmarkToggle={handleBookmarkToggle}
                />
            </div>
        )
    }
}

const mapStateToProps: MapStateToProps<
    StateProps,
    OwnProps,
    RootState
> = state => ({
    isExpanded: selectors.isExpanded(state),
    isRibbonEnabled: selectors.isRibbonEnabled(state),
    isTooltipEnabled: selectors.isTooltipEnabled(state),
    isPaused: pause.isPaused(state),
    isBookmarked: bookmark.isBookmarked(state),
    searchValue: popup.searchValue(state),
    url: popup.url(state),
    tags: tags.tags(state),
    initTagSuggs: tags.initTagSuggestions(state),
    collections: collections.collections(state),
    initCollSuggs: collections.initCollSuggestions(state),
})

const mapDispatchToProps: MapDispatchToProps<
    DispatchProps,
    OwnProps
> = dispatch => ({
    onInit: () => dispatch(actions.initState()),
    handleRibbonToggle: () => dispatch(actions.toggleRibbon()),
    handleTooltipToggle: () => dispatch(actions.toggleTooltip()),
    handleMouseEnter: () => dispatch(actions.setIsExpanded(true)),
    handleMouseLeave: () => dispatch(actions.setIsExpanded(false)),
    handlePauseToggle: () => dispatch(pauseActs.togglePaused()),
    handleBookmarkToggle: () => dispatch(bookmarkActs.toggleBookmark()),
    handleSearchChange: e => {
        e.preventDefault()
        const input = e.target as HTMLInputElement
        dispatch(popupActs.setSearchVal(input.value))
    },
    onTagAdd: (tag: string) => dispatch(tagActs.addTagToPage(tag)),
    onTagDel: (tag: string) => dispatch(tagActs.deleteTag(tag)),
    onCollectionAdd: (collection: PageList) =>
        dispatch(collectionActs.addCollectionToPage(collection)),
    onCollectionDel: (collection: PageList) =>
        dispatch(collectionActs.deleteCollection(collection)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RibbonContainer)

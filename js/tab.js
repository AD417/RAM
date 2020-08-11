Vue.component("gametab", {
	props: ["id", "tab"],
	data: function () {
		return {
			buttonOffset: this.id * 200 + 10,
		};
	},
	methods: {
		selectTab: function (n) {
			vm.selectTab(n);
			vm.$forceUpdate();
		},
		name: function (n) {
			return config_data.tab_names[n];
		},
	},
	template: `
        <div class='tab'>
            <div class="whitething" v-bind:style="{marginLeft: buttonOffset - 10, display: tab ? 'inline-block' : 'none'}">
                <div class="greything"></div>
            </div>
            <button class='tab_button' v-on:click="selectTab(id)" v-bind:class="{active: tab}" v-bind:style="{marginLeft: buttonOffset, backgroundColor: tab ? 'white' : 'lightGrey'}">{{ name(id) }}</button>
            <div class="whitething" v-bind:style="{display: tab ? 'inline-block' : 'none', zIndex: tab ? 100: 0}">
                <div class="greything2"></div>
            </div>
            <div class='tab_body' v-if="tab">
                <slot></slot>
            </div>
        </div>
    `,
});

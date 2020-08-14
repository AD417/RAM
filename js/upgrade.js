Vue.component("upgrade", {
	props: ["id", "pr"],
	data: function () {
		return {};
	},
	mounted: function () {
		tippy("#u" + this.id + "_" + this.pr, {
			content: f(this.cost()) + " chrome tabs",
			interactive: true,
		});
	},
	methods: {
		cost: function () {
			return D((10 ** (this.pr + 1)) ** (this.id + 1));
		},
		buy: function () {
			if (
				this.$parent.$parent.$parent.chromeTabs.gte(this.cost()) &&
				this.$parent.$parent.$parent.upgrades[this.pr].lte(this.id)
			) {
				this.$parent.$parent.$parent.chromeTabs = this.$parent.$parent.$parent.chromeTabs.sub(
					this.cost()
				);
				Vue.set(
					this.$parent.$parent.$parent.upgrades,
					this.pr,
					this.$parent.$parent.$parent.upgrades[this.pr].add(1)
				);
			}
		},
		bought: function () {
			return this.$parent.$parent.$parent.upgrades[this.pr].gt(this.id - 1);
		},
		f: f,
	},
	template: `
		<span v-on:click="buy()" v-bind:id="'u'+id+'_'+pr" class='upgrade' v-bind:class="{ bought: bought() }">
			{{ id }}
		</span>
    `,
});

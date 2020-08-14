Vue.component("autoclicker", {
	props: ["id", "name"],
	data: function () {
		return {
			lvl: this.$parent.$parent.$parent.autoclickers[this.id],
			interval: null,
			maxLvl: 10,
			first: true,
		};
	},
	methods: {
		cost: function () {
			return D(2).pow(this.lvl);
		},
		upgrade: function () {
			if (this.lvl < this.maxLvl && this.$parent.$parent.$parent.memoryLeaks.gte(this.cost())) {
				this.$parent.$parent.$parent.memoryLeaks = this.$parent.$parent.$parent.memoryLeaks.sub(
					this.cost()
				);
				this.lvl++;
			}
		},
		intv: function () {
			return Math.max(10 / 2 ** this.lvl, 0.001);
		},
	},
	computed: {
		update: function () {
			this.$parent.$parent.$parent.autoclickers[this.id] = this.lvl;
			clearInterval(this.interval);
			this.interval = setInterval(() => {
				vm.buy(this.id);
			}, this.intv() * 1000);
			return this.lvl;
		},
	},
	template: `
        <div class='autoclicker'>
            {{ name }} Autobuyer<br>
            <button @click="upgrade()">Upgrade for {{ cost() }} memory leak{{ cost().eq(1) ? '' : 's' }}</button><br>
            Interval: {{ intv() }}s<br>
            <span style="display: none">{{ update }}</span>
        </div>
    `,
});

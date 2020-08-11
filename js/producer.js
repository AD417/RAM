Vue.component("producer", {
	props: ["id", "name"],
	data: function () {
		return {};
	},
	methods: {
		buy: function () {
			if (this.$parent.$parent.chromeTabs.gte(this.cost())) {
				this.$parent.$parent.chromeTabs = this.$parent.$parent.chromeTabs.sub(this.cost());
				Vue.set(
					this.$parent.$parent.producers,
					this.id,
					this.$parent.$parent.producers[this.id].add(1)
				);
			}
		},
		cost: function () {
			return D(1.25)
				.pow(this.$parent.$parent.producers[this.id])
				.mul(config_data.producer_base_costs[this.id])
				.floor();
		},
		plural: function () {
			return !this.cost().eq(1);
		},
		count: function () {
			return this.$parent.$parent.producers[this.id];
		},
		unlocked: function () {
			return this.id == 0 || this.$parent.$parent.totalTabs.gte(this.cost().div(2));
		},
		f: f,
	},
	template: `
        <div class="producer" v-if="unlocked()">
            <hr>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <span class="producerName">&nbsp;{{ name }}&nbsp;&times;{{ f(count()) }}</span>
                        </td>
                        <td>
                            <button v-on:click="buy()" class='buyProducer'>Buy for {{ f(cost()) }} chrome tab{{ plural() ? 's' : ''}}</button>
                        </td>
						<td class="last">
							<upgrade
								v-for="i in 10"
								v-bind:key="i"
								v-bind:id="i"
								v-bind:pr="id"
							></upgrade>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>`,
});

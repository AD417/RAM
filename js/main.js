const D = n => new Decimal(n);

let vm = new Vue({
	el: "#app",
	data: {
		version: "0.0.1",
		configData: config_data,
		initData: {
			chromeTabs: D(10),
			totalTabs: D(0),
			totalRAM: D(4000000000),
			priceScaling: D(1),
			producers: [D(0), D(0), D(0), D(0)],
			upgrades: [D(0), D(0), D(0), D(0)],
			autoclickerintv: ["10", "10", "10", "10"],
			autoclickers: [0, 0, 0, 0],
			rpt: D(1000),
			prestiged: false,
			memoryLeaks: D(0),
		},
		chromeTabs: D(10),
		totalTabs: D(0),
		totalRAM: D(4000000000),
		priceScaling: D(1),
		producers: [D(0), D(0), D(0), D(0)],
		upgrades: [D(0), D(0), D(0), D(0)],
		autoclickerintv: ["10", "10", "10", "10"],
		autoclickers: [0, 0, 0, 0],
		rpt: D(1000),
		tabs: [true, false, false, false],
		state: 0,
		prestiged: false,
		prestiges: 0,
		memoryLeaks: D(0),
		loaded: false,
	},
	computed: {
		availableRAM: function () {
			return this.totalRAM.sub(this.chromeTabs.mul(this.rpt));
		},
		getSaveObject: function () {
			return {
				version: this.version,
				chromeTabs: this.chromeTabs.toString(),
				totalTabs: this.totalTabs.toString(),
				totalRAM: this.totalRAM.toString(),
				priceScaling: this.priceScaling.toString(),
				producers: JSON.stringify(this.producers.map(e => e.toString())),
				upgrades: JSON.stringify(this.upgrades.map(e => e.toString())),
				autoclickers: JSON.stringify(this.autoclickers),
				upgrades: JSON.stringify(this.upgrades.map(e => e.toString())),
				rpt: this.rpt.toString(),
				prestiged: this.prestiged,
				prestiges: this.prestiges,
				memoryLeaks: this.memoryLeaks,
				time: Date.now(),
			};
		},
		tps: function () {
			let inc = D(0);
			for (let i in this.producers)
				if (!isNaN(i))
					inc = inc.add(
						this.producers[i]
							.times(this.configData.producer_production[i])
							.times(D(2).pow(this.upgrades[i].mul(+i + 1)))
							.times(0.05)
					);
			return inc;
		},
	},
	methods: {
		init: function (wipe = false) {
			this.load(this.initData, wipe);
			if (window.outerHeight > window.outerWidth)
				alert(
					"Please turn your device into landscape mode to play this game, otherwise the UI will look weird :p"
				);
			setInterval(this.loop, 50);
			setInterval(this.save, 5000);
		},
		loop: function () {
			this.chromeTabs = this.chromeTabs.add(this.tps);
			this.totalTabs = this.totalTabs.add(this.tps);
			if (this.availableRAM.lt(0)) this.crash();
		},
		wipe: function () {
			if (/* true ||  */ confirm("Are you sure you want to lose all progress???")) this.init(true);
		},
		save: function () {
			let save = btoa(JSON.stringify(this.getSaveObject));
			localStorage.setItem("ram_save_file", save);
		},
		load: function (save, ignoreLS = false) {
			let t = localStorage.getItem("ram_save_file");
			try {
				if (t && !ignoreLS) {
					save = t;
					save = JSON.parse(atob(save));
					save.producers = JSON.parse(save.producers) || this.initData.producers;
					save.upgrades = JSON.parse(save.upgrades) || this.initData.upgrades;
					save.autoclickers = JSON.parse(save.autoclickers) || this.initData.autoclickers;
				}
			} catch (e) {}
			this.chromeTabs = D(save.chromeTabs);
			this.totalTabs = D(save.totalTabs);
			this.totalRAM = D(save.totalRAM);
			this.priceScaling = D(save.priceScaling);
			this.rpt = D(save.rpt);
			this.memoryLeaks = D(save.memoryLeaks);
			this.prestiged = save.prestiged;
			this.prestiges = save.prestiges;

			let a = save.producers.map(e => D(e));
			for (let i in a) {
				Vue.set(this.producers, i, a[i]);
			}
			let b = save.upgrades.map(e => D(e));
			for (let i in b) {
				Vue.set(this.upgrades, i, b[i]);
			}
			let c = save.autoclickers;
			for (let i in c) {
				Vue.set(this.autoclickers, i, c[i]);
			}

			this.chromeTabs = this.chromeTabs.add(this.offlineTabs((Date.now() - save.time) / 1000));

			this.save();
		},
		selectTab: function (n) {
			this.tabs.fill(false);
			this.tabs[n] = true;
		},
		f: function (n, type = "standard") {
			return f(n, type);
		},
		crash: function () {
			this.prestiged = true;
			this.chromeTabs = D(10);
			for (let i in this.producers) Vue.set(this.producers, i, D(0));
			for (let i in this.upgrades) Vue.set(this.upgrades, i, D(0));
			this.state = 1;
			this.prestiges++;
			this.memoryLeaks = this.memoryLeaks.add(1);
		},
		buyPrestigeUpg: function (n) {
			if (this.memoryLeaks.lt(1)) return;
			this.memoryLeaks = this.memoryLeaks.sub(1);
			switch (n) {
				case 0:
					this.rpt = this.rpt.mul(1.2);
					break;
				case 1:
					this.totalRAM = this.totalRAM.div(1.5);
					break;
				case 2:
					this.priceScaling = this.priceScaling.mul(0.9);
				default:
					break;
			}
		},
		offlineTabs: function (timesecs) {
			return this.tps.mul(timesecs).mul(20);
		},
		buy: function (n) {
			let cost = D(1.25)
				.pow(this.producers[n])
				.mul(config_data.producer_base_costs[n])
				.mul(this.priceScaling)
				.ceil();
			if (this.chromeTabs.gte(cost)) {
				this.chromeTabs = this.chromeTabs.sub(cost);
				Vue.set(this.producers, n, this.producers[n].add(1));
			}
		},
	},
});

Vue.component("flexbox", {
	template: `<div class="flexbox"><slot></slot></div>`,
});

({
        //
        // Get a component, clearing the configs if necessary.
        //
	doGet : function(doGetComponent, descriptor, haveComponents) {
		var action = $A.get("c.aura://ComponentController.get" + (doGetComponent ? "Component" : "Application"));
                // sanity check.
                $A.test.assertTrue(haveComponents !== undefined);
		action.setParams({
			name : descriptor
		});
		var gotResponse = false;
		action.setCallback(this, function(a) {
			gotResponse = true;
                        if (haveComponents) {
                            $A.test.clearAndAssertComponentConfigs(a);
                        }
		});
		$A.test.callServerAction(action);
		$A.test.addWaitFor(true, function() {
			return gotResponse;
		});
	},

	getUid : function(fullDescriptor) {
		var loaded = $A.getContext().getLoaded();
		return loaded[fullDescriptor];
	},

	assertNoUid : function(fullDescriptor) {
		var uid = this.getUid(fullDescriptor);
		$A.test.assertUndefined(uid);
	},

	assertUid : function(fullDescriptor) {
		// instead of checking value, just check that it is non-empty string
		var uid = this.getUid(fullDescriptor);
		$A.test.assertDefined(uid, "missing uid for " + fullDescriptor);
		$A.test.assertTrue(typeof (uid) === "string", "expected uid to be a string for " + fullDescriptor);
		$A.test.assertTrue(uid.length > 0, "expected non-empty string for uid for " + fullDescriptor);
	},

    /**
     * Application that is not preloaded will appear in loaded set.
     */
	testLoaded_UnloadedApplicationIsLoaded : {
		labels : [ "auraSanity" ],
		test : [ function(c) {
			this.assertNoUid("APPLICATION@markup://aura:application");
			this.doGet(false, "aura:application", true);
		}, function(c) {
			this.assertUid("APPLICATION@markup://aura:application");
		} ]
	},

    /**
     * Component that is preloaded, because it is an implicit dependency, will not appear in loaded set.
     */
	testLoaded_UnloadedImplicitDependencyIsNotLoaded : {
		labels : [ "auraSanity" ],
		test : [ function(c) {
			this.assertNoUid("COMPONENT@markup://aura:component");
			this.doGet(true, "aura:component", false);
		}, function(c) {
			this.assertNoUid("COMPONENT@markup://aura:component");
		} ]
	},

    /**
     * Component that is preloaded, because it is a namespace dependency, will not appear in loaded set.
     */
	testLoaded_PreloadedNamespaceDependencyIsNotLoaded : {
		labels : [ "auraSanity" ],
		test : [ function(c) {
			this.assertNoUid("COMPONENT@markup://aura:text");
			this.doGet(true, "aura:text", false);
		}, function(c) {
			this.assertNoUid("COMPONENT@markup://aura:text");
		} ]
	},
	
    /**
     * Component that is not preloaded will appear in loaded set.
     */
	testLoaded_UnloadedComponentIsLoaded : {
		labels : [ "auraSanity" ],
		test : [ function(c) {
			this.assertNoUid("COMPONENT@markup://auratest:text");
			this.doGet(true, "auratest:text", true);
		}, function(c) {
			this.assertUid("COMPONENT@markup://auratest:text");
			this.assertNoUid("COMPONENT@markup://auratest:html"); //check that another namespace component is not loaded
		} ]
	},

    /**
     * Dependencies of loaded component will not appear in loaded set.
     */
	testLoaded_DependencyIsNotLoaded : {
		labels : [ "auraSanity" ],
		test : [ function(c) {
			this.assertNoUid("COMPONENT@markup://auratest:testComponent1");
			this.doGet(true, "auratest:testComponent1", true);
		}, function(c) {
			this.assertUid("COMPONENT@markup://auratest:testComponent1");
			this.assertNoUid("COMPONENT@markup://auratest:testComponent2"); //contained dependency is not loaded
			this.assertNoUid("COMPONENT@markup://auratest:html"); //check that another namespace component is not loaded
		} ]
	},
	
    /**
     * Dependencies of loaded component, even if loaded explicitly, will not appear in loaded set.
     */
	testLoaded_DependencyIsNotLoadedEvenIfExplicitlyLoaded : {
		labels : [ "auraSanity" ],
		test : [ function(c) {
			this.assertNoUid("COMPONENT@markup://auratest:testComponent1");
			this.assertNoUid("COMPONENT@markup://auratest:testComponent2");
			this.doGet(true, "auratest:testComponent1", true);
		}, function(c) {
			this.assertUid("COMPONENT@markup://auratest:testComponent1");
			this.assertNoUid("COMPONENT@markup://auratest:testComponent2"); //contained dependency is not loaded
			this.doGet(true, "auratest:testComponent2", false);
		}, function(c) {
			this.assertUid("COMPONENT@markup://auratest:testComponent1");
			this.assertNoUid("COMPONENT@markup://auratest:testComponent2"); //dependency is still not loaded
		} ]
	},

    /**
     * Loaded component with dependency of an already loaded component will remove the dependency from the loaded set.
     * W-1989778
     */
	_testLoaded_LoadedDependencyIsUnloadedIfParentIsLoaded : {
		labels : [ "auraSanity" ],
		test : [ function(c) {
			this.assertNoUid("COMPONENT@markup://auratest:testComponent1");
			this.assertNoUid("COMPONENT@markup://auratest:testComponent2");
			this.doGet(true, "auratest:testComponent2", false);
		}, function(c) {
			this.assertNoUid("COMPONENT@markup://auratest:testComponent1");
			this.assertUid("COMPONENT@markup://auratest:testComponent2");
			this.doGet(true, "auratest:testComponent1", false);
		}, function(c) {
			this.assertUid("COMPONENT@markup://auratest:testComponent1");
			this.assertNoUid("COMPONENT@markup://auratest:testComponent2"); // TODO: dependency is not removed from loaded set
		} ]
	}
	
})

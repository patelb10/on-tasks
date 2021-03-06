// Copyright 2015, EMC, Inc.

'use strict';

var di = require('di');

module.exports = ansibleFactory;

di.annotate(ansibleFactory, new di.Provide('JobUtils.Ansible.Playbook'));
di.annotate(ansibleFactory, new di.Inject(
            'Assert',
            'ChildProcess'
));

function ansibleFactory(assert, ChildProcess) {
    /**
     * @constructor
     */
    function AnsibleTool() {
        this.childProcess = undefined;
    }

    AnsibleTool.prototype.runPlaybook = function(nodeid, playbook, limit, extraArgs) {
        var env = {
            'nodeid': nodeid
        };
        var args = [ '-i', '/opt/onrack/etc/ansible/rackhd.py', '-l' ];
        if( limit ) {
          args.push(limit);
        } else {
          args.push(nodeid);
        }
        if( extraArgs )  {
          args.push("--extra-vars");
          args.push(extraArgs);
        }
        args.push(playbook);

        this.childProcess = new ChildProcess('/usr/bin/ansible-playbook',
                                             args,
                                             env);
        return this.childProcess.run();
    };

    AnsibleTool.prototype.kill = function() {
        if(this.childProcess) {
            this.childProcess.killSafe();
        }
    };

    return AnsibleTool;
}
